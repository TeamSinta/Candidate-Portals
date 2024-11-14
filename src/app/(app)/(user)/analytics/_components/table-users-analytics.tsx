"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, ChevronDownIcon } from "lucide-react"; // Example icons
import Image from "next/image";

const visitors = [
  {
    email: "mohamed@sintah.com",
    company: "Garage Capital",
    timeAgo: "1mo ago",
    avatar: "/path/to/avatar1.png", // Replace with actual image paths
    visitType: "Internal visit",
    pitchTitle: "Sinta Pitch (2024)",
    duration: "00:33",
  },
  {
    email: "Windows visitor",
    company: "Garage Capital",
    timeAgo: "2mo ago",
    avatar: null,
    visitType: null,
    pitchTitle: "Sinta Pitch (2024)",
    duration: "01:17",
  },
  {
    email: "Mac visitor",
    company: "Miro",
    timeAgo: "2mo ago",
    avatar: null,
    visitType: null,
    pitchTitle: "Sinta Pitch (2024)",
    duration: "00:21",
  },
  // Add more visitor objects as needed
];

export default function VisitorsTable() {
  return (
    <Card className="shadow-none rounded-md mx-28 mt-6">
    <CardHeader className="pb-8">
     <CardTitle className="text-lg font-semibold">Vistors</CardTitle>

     <CardTitle className="text-4xl font-medium">3</CardTitle>
   </CardHeader>
      <CardContent className="p-0">
        <Table className="border-separate border-spacing-0">
          <TableHeader className="bg-gray-50">
            <TableRow className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
              <TableCell className="py-3 px-4">Visitor</TableCell>
              <TableCell className="py-3 px-4">Role</TableCell>
              <TableCell className="py-3 px-4">Visit Type</TableCell>
              <TableCell className="py-3 px-4">Portal Title</TableCell>
              <TableCell className="py-3 px-4">Duration</TableCell>
              <TableCell className="py-3 px-4 ">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitor, index) => (
              <TableRow key={index} className="hover:bg-gray-100">
                <TableCell className="py-4 px-4 flex items-center gap-3">

<Image
className="rounded-full"
width={28}
height={28}
alt="user pic"
src={`https://avatar.vercel.sh/${visitor.company}`}
/>
                  <div>
                    <p className="font-medium text-gray-800">{visitor.email}</p>
                    <p className="text-xs text-gray-500">{visitor.timeAgo}</p>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-700">
                  {visitor.company}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-700">
                  {visitor.visitType ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {visitor.visitType}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-700">
                  {visitor.pitchTitle}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm flex items-center gap-1 text-gray-700">
                  {visitor.duration}
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                </TableCell>
                <TableCell className="py-4 px-4 text-right">
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
