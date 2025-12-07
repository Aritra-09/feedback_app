"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import feedbacks from "@/feedbacks.json"
import Autoplay from 'embla-carousel-autoplay'
import Link from "next/link";


export default function Home() {
  return (
   <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center px-6 mt-6">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Anonymous <span className="text-blue-600">Feedbacks </span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Collect honest and anonymous feedback from your team, classmates, or
          community — securely and effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full max-w-6xl mt-10 grid md:grid-cols-3 gap-6 text-left">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            💬 Anonymous Feedback
          </h3>
          <p className="text-gray-600">
            Empower others to share honest opinions without fear or bias.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            🔒 Privacy First
          </h3>
          <p className="text-gray-600">
            We never collect names or identities — all feedback remains
            confidential.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            🚀 Easy Sharing
          </h3>
          <p className="text-gray-600">
            Generate your personal link, share it anywhere, and start collecting
            feedback instantly.
          </p>
        </div>
      </section>

      <Carousel className="w-full max-w-xs my-20">
      <CarouselContent>
        {feedbacks.map((feedback, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>{feedback.title}</CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-xl font-semibold">{feedback.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} Anonymous Feedbacks. All rights reserved.
      </footer>
    </main>
  );
}
