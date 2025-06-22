import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { dogName, breed, gender, age, behaviors } = await request.json();

    // Create dog profile data to pass to the prompt
    const dogProfileInput = `dogName: ${dogName}, breed: ${breed}, gender: ${gender}, age: ${age}, behaviors: ${behaviors.join(', ')}`;

    const response = await openai.responses.create({
      prompt: {
        id: 'pmpt_6857d305fab88190ae3fb5cb94c81fc30f42ad1331d81eff',
        version: '3',
      },
      input: dogProfileInput,
    });

    // Parse the structured JSON response
    let summary = '';
    let goal = '';
    let tasks: string[] = [];

    try {
      // The response has an output_text field containing the JSON string
      const outputText = response.output_text;

      if (outputText && typeof outputText === 'string') {
        const parsedResponse = JSON.parse(outputText);

        summary = parsedResponse.summary || '';
        goal = parsedResponse.goal || '';

        if (parsedResponse.toDoPlan && Array.isArray(parsedResponse.toDoPlan)) {
          tasks = parsedResponse.toDoPlan
            .map((item: any) => item.task || '')
            .filter((task: string) => task.length > 0);
        }
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // Fallback values will be set below
    }

    // Provide fallback values if parsing didn't work
    if (!summary) {
      summary = "Generated summary for your dog's training plan.";
    }
    if (!goal) {
      goal = "Generated goal for your dog's development.";
    }
    if (tasks.length === 0) {
      tasks = [
        'Daily walks of 45 minutes',
        'Scent games / mental tasks',
        'Recommended course: "Sit, Stay, Come"',
        'Behavioral training sessions',
      ];
    }

    return NextResponse.json({
      summary,
      goal,
      tasks,
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
