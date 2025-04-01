"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Users, Map, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Help() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          We're here to assist you in making the most of Turftap, your community-driven sports ground discovery platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>For Contributors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Learn how to add new sports grounds, update information, and earn Turftap points.</p>
            <Link href="/grounds/create">
              <Button className="w-full">Add a Sports Ground</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-green-600" />
              <span>For Explorers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Discover how to find the perfect sports ground and make the most of the platform.</p>
            <Link href="/sports">
              <Button variant="outline" className="w-full">Explore Grounds</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions about using Turftap</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Turftap?</AccordionTrigger>
              <AccordionContent>
                Turftap is a community-driven platform where sports enthusiasts can discover and share information about local sports grounds. Our goal is to make it easier for everyone to find places to play their favorite sports.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I earn Turftap points?</AccordionTrigger>
              <AccordionContent>
                You earn points by contributing to the platform. Add new sports grounds, update information, upload photos, and engage with the community. The more you contribute, the more points you'll earn.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How can I report incorrect information?</AccordionTrigger>
              <AccordionContent>
                If you notice any incorrect information about a sports ground, you can submit an update through the ground's detail page. Click on "Suggest Edit" and provide the correct information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is Turftap available in my area?</AccordionTrigger>
              <AccordionContent>
                Turftap is growing every day thanks to our community. If there are no sports grounds listed in your area yet, you can be the first to contribute! Add your local grounds and help build the community.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <span>Need More Help?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            We're continuously improving Turftap based on your feedback. If you couldn't find the answer you're looking for, please reach out to our support team.
          </p>
          <div className="flex justify-center">
            <a href="mailto:purvaspatel1241@gmail.com">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Contact Support</span>
              </Button>
            </a>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}