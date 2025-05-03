
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FileText, Info, AlertTriangle } from "lucide-react";

const AdminImportGuide: React.FC = () => {
  return (
    <ScrollArea className="h-[calc(100vh-220px)] pr-4">
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-greentrail-600 dark:text-greentrail-400" />
            <CardTitle>Trail Data Import Guide</CardTitle>
          </div>
          <CardDescription>
            A comprehensive guide for administrators managing trail data imports
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground mb-4">
                The Trail Data Import system allows administrators to import trail data from various sources into the GreenTrails platform.
                This guide explains how to use both individual and bulk import functionality.
              </p>
              
              <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <Info className="h-4 w-4" />
                <AlertTitle>Database tables are created automatically</AlertTitle>
                <AlertDescription>
                  The first time you access the import page, necessary database tables will be automatically created.
                </AlertDescription>
              </Alert>
            </section>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="bulk-import">
                <AccordionTrigger className="text-lg font-medium">Bulk Import Process</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>
                    Bulk importing allows you to import large numbers of trails from multiple sources at once.
                    Follow these steps to perform a bulk import:
                  </p>
                  
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Click the <strong>Bulk Import</strong> button in the header section of the import page.</li>
                    <li>In the dialog that appears, select the data sources you wish to import from.</li>
                    <li>Use the slider to set the number of trails you want to import (up to 60,000).</li>
                    <li>Click <strong>Start Bulk Import</strong> to begin the process.</li>
                    <li>A progress card will appear showing the import status.</li>
                    <li>The system will automatically switch to the "Bulk Jobs" tab where you can monitor progress.</li>
                  </ol>
                  
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Performance Considerations</AlertTitle>
                    <AlertDescription>
                      Large imports (over 10,000 trails) may take significant time. The system processes trails in batches to optimize performance.
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="individual-imports">
                <AccordionTrigger className="text-lg font-medium">Individual Source Imports</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>
                    You can also import trails from a specific source individually:
                  </p>
                  
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Go to the <strong>Data Sources</strong> tab.</li>
                    <li>Find the source you wish to import from.</li>
                    <li>Click the <strong>Import</strong> button for that source.</li>
                    <li>The system will queue an import job that you can track in the <strong>Import Jobs</strong> tab.</li>
                  </ol>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 dark:bg-amber-900/20 dark:border-amber-800">
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      Note: Only active sources can be imported. Inactive sources will have a disabled Import button.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="monitoring">
                <AccordionTrigger className="text-lg font-medium">Monitoring Import Jobs</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>
                    You can monitor the status of both individual and bulk import jobs:
                  </p>
                  
                  <h4 className="font-medium mt-4">Individual Jobs</h4>
                  <p>Individual import jobs can be monitored in the <strong>Import Jobs</strong> tab. This tab shows:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Source name</li>
                    <li>Start time</li>
                    <li>Status (Processing, Completed, or Error)</li>
                    <li>Number of trails added, updated, and failed</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4">Bulk Jobs</h4>
                  <p>Bulk import jobs are tracked in the <strong>Bulk Jobs</strong> tab. This tab displays:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Start time</li>
                    <li>Status</li>
                    <li>Total trails requested</li>
                    <li>Number of sources</li>
                    <li>Processing progress statistics</li>
                    <li>Completion percentage</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="strain-tags">
                <AccordionTrigger className="text-lg font-medium">Strain Tags for Cannabis-Friendly Trails</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>
                    The system automatically creates default strain tags for cannabis-friendly trails during the database setup.
                    These tags include:
                  </p>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Strain Type</TableHead>
                        <TableHead>Effects</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Sativa</TableCell>
                        <TableCell>Energizing, uplifting, creative</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Indica</TableCell>
                        <TableCell>Relaxing, sedating, pain relief</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Hybrid</TableCell>
                        <TableCell>Balanced, varied effects</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">CBD</TableCell>
                        <TableCell>Non-psychoactive, therapeutic</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    These tags can be assigned to trails using the trail editing interface after import.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="troubleshooting">
                <AccordionTrigger className="text-lg font-medium">Troubleshooting</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <h4 className="font-medium">Database Setup Failures</h4>
                  <p>
                    If the automatic database setup fails, you will see an error alert. You can click <strong>Try Again</strong>
                    to reattempt the setup process. If problems persist, check the browser console for specific error details.
                  </p>
                  
                  <h4 className="font-medium mt-4">Import Job Failures</h4>
                  <p>
                    If an import job fails, check the following:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Ensure the data source URL is valid and accessible</li>
                    <li>Check that the source format is supported by the system</li>
                    <li>Verify that the database has sufficient space</li>
                    <li>Look for any network connectivity issues</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4">Performance Optimization</h4>
                  <p>
                    For optimal performance during bulk imports:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Import during off-peak hours</li>
                    <li>Start with smaller batches (5,000-10,000 trails) before attempting larger imports</li>
                    <li>If importing multiple sources, consider doing them separately to better track issues</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default AdminImportGuide;
