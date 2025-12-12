// /app/api/ideas/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const text: string = body.text;

        if (!text || text.trim() === '') {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const idea = await db.idea.create({
            data: {
                text: text.trim(),
            },
        });

        return NextResponse.json(idea);
    } catch (err) {
        console.error('Error creating idea:', err);
        return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
    }
}
