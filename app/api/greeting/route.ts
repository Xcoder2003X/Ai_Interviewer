import { NextResponse } from 'next/server';

// Mock interview questions - replace with your actual data
const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What interests you about this position?",
  "Describe a challenging project you worked on and how you handled it.",
  "Where do you see yourself in 5 years?",
  "Do you have any questions for me?"
];

export async function POST(request : Request) {
  try {
    const body = await request.json();
    console.log('Vapi webhook received:', body);
    
    const { tool_call_id, tool, conversation } = body;
    
    if (!tool_call_id || !tool) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Check if this is the start of conversation
    const isNewConversation = !conversation || conversation.messages.length === 0;
    
    let greetingMessage;
    
    if (isNewConversation) {
      // First message - start the interview
      greetingMessage = `Hello! Welcome to your practice interview. I'll be asking you ${INTERVIEW_QUESTIONS.length} questions to help you prepare. Let's start with the first question: ${INTERVIEW_QUESTIONS[0]}`;
    } else {
      // Continue with next question or wrap up
      // You can add logic here to track question progression
      greetingMessage = "Great! Let's continue with the next question.";
    }
    
    const response = {
      result: greetingMessage,
      // You can include additional metadata for your workflow
      metadata: {
        interviewStarted: isNewConversation,
        totalQuestions: INTERVIEW_QUESTIONS.length,
        currentQuestionIndex: 0
      }
    };
    
    console.log('Sending response:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}