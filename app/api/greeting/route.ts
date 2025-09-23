import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received:', JSON.stringify(body, null, 2));
    
    // Réponse simple pour tester
    return NextResponse.json({
      result: "Hello! Welcome to your practice interview. Let's get started!"
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}