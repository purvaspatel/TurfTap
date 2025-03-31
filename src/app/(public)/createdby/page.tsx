// app/contact/page.tsx
import Image from "next/image"
import { Metadata } from "next";
import { Mail, Github, Instagram } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900  mb-4">
                    Hey, I am glad that you made it here!!
                </h1>
            </div>
            <div className="flex flex-col items-center mb-16">
                <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-2 border-gray-200 ">
                    <Image
                        src="/purvaprofilepic.jpg" // Your photo
                        alt="Purva Patel"
                        fill
                        className="object-cover"

                    />
                </div>

                <h2 className="text-xl font-medium text-gray-900 mb-3">Purva Patel</h2>


                <div className="flex gap-4">
                    <a
                        href="mailto:purvaspatel1241@gmail.com"
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200  transition-colors"
                        aria-label="Email"
                    >
                        <Mail className="w-5 h-5" />
                    </a>
                    <a
                        href="https://github.com/purvaspatel"
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200  transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                    <a
                        href="https://instagram.com/purvvvva"
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200  transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>
            </div>
            <div className="prose  text-center mx-auto">
                <p>
                    I created this website to build a community-powered sports exploration platform where real players can share their favorite playing grounds and provide genuine reviews. This allows new enthusiasts to discover and explore the best turfs with real, firsthand insights.
                    A special thanks to my friends Kalash and Manan for their invaluable support in shaping the first version of this platform and contributing their ideas to bring this vision to life."
                </p>
                <p className="mt-4">
                    Not much for formal emails? Me neither. Just say "hey" and we'll go from there.
                </p>
                <p className="mt-6 text-sm text-gray-500 ">
                    PS: Ping me up for a football match.
                </p>
            </div>
        </div>
    )
}