import { NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
    baseURL: "https://beta.sree.shop/v1",
    apiKey: process.env.OPENAI_API_KEY
})

// export const runtime = "edge"

const prompt = ` Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.
These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or 
sensitive topics, focus ing instead on universal themes that encourage friendly interaction. For example, your output should be structured like
this: 'What’s a hobby you’ve recently started?||If you could have dinner with unknown historical figure, who would it be?||What’s a simple thing 
that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;


export async function GET() {
    try {
        const response = await client.chat.completions.create({
            model: 'Provider-7/deepseek-v3',
            messages: [
                { role: 'user', content: prompt }
            ]
        })
        
        return NextResponse.json({ 
            response: response.choices[0].message.content,
            message: "Got response from AI" 
        }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ 
            message: error.message
        }, { status: 500 })
    }
}

