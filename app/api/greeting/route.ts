import { NextResponse } from 'next/server';

// Your PFE interview workflow questions (adapt based on your image)
const PFE_WORKFLOW_QUESTIONS = {
  introduction: "Welcome to your PFE practice interview. Let's begin with some questions about your background and experience.",
  technical: [
    "Describe your technical background and relevant skills",
    "What programming languages are you most comfortable with?",
    "Tell me about a challenging technical problem you solved"
  ],
  behavioral: [
    "How do you handle working under pressure?",
    "Describe a time you worked successfully in a team",
    "What motivates you in your work?"
  ],
  situational: [
    "How would you approach a project with tight deadlines?",
    "What would you do if you disagreed with a technical decision?"
  ]
};

export async function POST(request :Request) {
  try {
    const body = await request.json();
    console.log('PFE Workflow Triggered:', body);

    const { conversation, tool_call_id } = body;
    
    // Determine interview stage based on conversation history
    const messageCount = conversation?.messages?.length || 0;
    const userMessages = conversation?.messages?.filter(msg => msg.role === 'user') || [];
    
    let workflowStage;
    let responseMessage;
    let nextAction;

    if (messageCount === 0) {
      // Stage 1: Introduction
      workflowStage = 'introduction';
      responseMessage = PFE_WORKFLOW_QUESTIONS.introduction;
      nextAction = 'ask_technical_questions';
      
    } else if (userMessages.length <= 3) {
      // Stage 2: Technical questions
      const techIndex = Math.min(userMessages.length - 1, PFE_WORKFLOW_QUESTIONS.technical.length - 1);
      workflowStage = 'technical';
      responseMessage = PFE_WORKFLOW_QUESTIONS.technical[techIndex];
      nextAction = techIndex < PFE_WORKFLOW_QUESTIONS.technical.length - 1 ? 'continue_technical' : 'move_to_behavioral';
      
    } else if (userMessages.length <= 6) {
      // Stage 3: Behavioral questions
      const behavioralIndex = Math.min(userMessages.length - 4, PFE_WORKFLOW_QUESTIONS.behavioral.length - 1);
      workflowStage = 'behavioral';
      responseMessage = PFE_WORKFLOW_QUESTIONS.behavioral[behavioralIndex];
      nextAction = behavioralIndex < PFE_WORKFLOW_QUESTIONS.behavioral.length - 1 ? 'continue_behavioral' : 'move_to_situational';
      
    } else {
      // Stage 4: Situational questions or conclusion
      const situationalIndex = Math.min(userMessages.length - 7, PFE_WORKFLOW_QUESTIONS.situational.length - 1);
      
      if (situationalIndex < PFE_WORKFLOW_QUESTIONS.situational.length) {
        workflowStage = 'situational';
        responseMessage = PFE_WORKFLOW_QUESTIONS.situational[situationalIndex];
        nextAction = 'continue_situational';
      } else {
        workflowStage = 'conclusion';
        responseMessage = "Thank you for completing the interview. Is there anything you'd like to ask me?";
        nextAction = 'end_interview';
      }
    }

    // Return structured workflow response
    const workflowResponse = {
      result: responseMessage,
      metadata: {
        workflow: 'pfe_interview',
        stage: workflowStage,
        nextAction: nextAction,
        progress: {
          currentStep: userMessages.length + 1,
          totalSteps: 10 // Adjust based on your workflow
        },
        timestamp: new Date().toISOString()
      }
    };

    console.log('PFE Workflow Response:', workflowResponse);
    return NextResponse.json(workflowResponse);

  } catch (error) {
    console.error('PFE Workflow Error:', error);
    
    // Fallback response if workflow fails
    return NextResponse.json({
      result: "Welcome to your PFE practice interview. Let's start by discussing your background and experience.",
      metadata: {
        workflow: 'pfe_interview',
        stage: 'fallback',
        error: 'Workflow processing issue'
      }
    });
  }
}