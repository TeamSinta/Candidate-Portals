import { millisecondsToTime } from "@/lib/utils";
import { MergedEngagedData, PortalData, SectionData } from "@/types/portal";
import { ExtendedSectionData, MergedSectionData } from "@/types/portal";

export async function calculateViewCounts(
    portalData: PortalData,
    getSectionDuration: (params: {
        link_id: string;
    }) => Promise<{ data: SectionData[] }>,
) {
    const counts: { [key: string]: number } = {};
    const progressData: { [key: string]: number } = {};

    for (const link of portalData.links) {
        const data = await getSectionDuration({ link_id: link.linkId });
        const filteredData = data.data.filter(
            (item) => item.link_id === link.linkId,
        );

        // Create a Set to track unique session IDs
        const uniqueSessionIds = new Set(
            filteredData.map((item) => item.session_id),
        );

        // Count the number of unique session IDs
        counts[link.linkId] = uniqueSessionIds.size;

        const uniqueSectionIdsFromData = [
            ...new Set(filteredData.map((item) => item.section_id)),
        ];
        const uniqueSectionIdsFromPortal = [
            ...new Set(
                portalData.sections.map((section) => section.section_id),
            ),
        ];

        const matchingSectionIds = uniqueSectionIdsFromData.filter((id) =>
            uniqueSectionIdsFromPortal.includes(id),
        );

        const progressRatio =
            uniqueSectionIdsFromPortal.length > 0
                ? matchingSectionIds.length / uniqueSectionIdsFromPortal.length
                : 0;

        progressData[link.linkId] = progressRatio;
    }

    return { counts, progressData };
}

// Function to merge Tinybird data with portal section data
export function averageDurationData(
    portalData: PortalData,
    tinybirdData: ExtendedSectionData[] | any,
): MergedSectionData[] {
    // Check if tinybirdData is an object and has the 'data' property as an array
    if (!tinybirdData || !Array.isArray(tinybirdData.data)) {
        console.error(
            "Expected an array for tinybirdData.data, but received:",
            tinybirdData,
        );
        tinybirdData = { data: [] }; // Fallback to an object with an empty 'data' array
    }

    // Create a map to store total durations by section_id from Tinybird data
    const tinybirdDurationMap: Record<
        string,
        { section_title: string; total_duration: number }
    > = {};

    // Populate the map with Tinybird data and convert duration to seconds
    tinybirdData.data.forEach((item: ExtendedSectionData) => {
        if (!tinybirdDurationMap[item.section_id])
            tinybirdDurationMap[item.section_id] = {
                section_title: item.section_title,
                total_duration: item.average_duration
                    ? item.average_duration / 1000
                    : 0, // Convert to seconds
            };
        else
            tinybirdDurationMap[item.section_id].total_duration +=
                item.average_duration ? item.average_duration / 1000 : 0;
    });

    // Iterate over the portal sections to create the merged data
    const mergedData: MergedSectionData[] = portalData.sections.map(
        (section) => {
            const durationData = tinybirdDurationMap[section.section_id] || {
                section_title: section.title || "Untitled",
                total_duration: 0,
            };

            return {
                section_id: section.section_id,
                section_title: section.title || "Untitled",
                total_duration: durationData.total_duration,
            };
        },
    );

    return mergedData;
}

export function topEngagedData(
    portalData: PortalData,
    tinybirdData: any, // Adjust the type of tinybirdData if you have a specific type
): MergedEngagedData[] {
    // Check if tinybirdData has the 'data' property as an array
    if (!tinybirdData || !Array.isArray(tinybirdData.data)) {
        console.error(
            "Expected an array for tinybirdData.data, but received:",
            tinybirdData,
        );
        tinybirdData = { data: [] }; // Fallback to an object with an empty 'data' array
    }

    // Create a map to store candidate names by candidateId
    const candidateNameMap: Record<string, string> = {};
    portalData.candidates.forEach((candidate) => {
        candidateNameMap[candidate.candidateId] = candidate.name;
    });

    // Merge Tinybird data with Portal data
    const mergedData: MergedEngagedData[] = tinybirdData.data
        .filter((item: { link_id: string }) => {
            // Filter Tinybird data to only include links that exist in portalData.links
            return portalData.links.some(
                (link) => link.linkId === item.link_id,
            );
        })
        .map(
            (item: {
                link_id: string;
                portal_id: any;
                user_id: any;
                total_duration: any;
                last_view_timestamp: any;
            }) => {
                // Find the corresponding link and candidate
                const link = portalData.links.find(
                    (link) => link.linkId === item.link_id,
                );
                const candidateName = link
                    ? candidateNameMap[link.candidateId]
                    : "Unknown Candidate";

                return {
                    link_id: item.link_id,
                    portal_id: item.portal_id,
                    user_id: item.user_id,
                    total_duration: item.total_duration
                        ? item.total_duration / 1000
                        : 0, // Convert to seconds
                    last_view_timestamp: item.last_view_timestamp,
                    candidate_name: candidateName, // Add candidate name
                };
            },
        );

    return mergedData;
}

export function averageCandidateDuration(engagedData: MergedEngagedData[]) {
    // Check if tinybirdData has the 'data' property as an array
    if (!engagedData || !Array.isArray(engagedData)) {
        console.error(
            "Expected an array for engagedData, but received:",
            engagedData,
        );
        engagedData = [];
    }

    const totalSeconds = engagedData.reduce((a, b) => a + b.total_duration, 0);
    const totalMS = totalSeconds * 1000;
    const totalAverageMS = totalMS / engagedData.length;
    return millisecondsToTime(totalAverageMS);
}
