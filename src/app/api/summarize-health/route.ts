import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const {
      mood,
      activity,
      symptoms,
      behaviors,
      feeding,
      description,
      dogName,
      breed,
      gender,
      age,
    } = await request.json();

    // Create health check data to pass to the prompt
    const healthCheckInput = `dogName: ${dogName}, breed: ${breed}, gender: ${gender}, age: ${age}, mood: ${mood}, activity: ${activity}, symptoms: ${symptoms.join(', ')}, behaviors: ${behaviors.join(', ')}, feeding: ${feeding}, description: ${description}`;

    const response = await openai.responses.create({
      prompt: {
        id: 'pmpt_6857e766fea48194b581f20d367a3dba06efa06e68d79dfa',
        version: '1',
      },
      input: healthCheckInput,
    });

    console.log(response);

    // Parse the structured JSON response
    let overallStatus = '';
    let summary = '';
    let recommendations: string[] = [];

    try {
      // The response has an output_text field containing the JSON string
      const outputText = response.output_text;

      if (outputText && typeof outputText === 'string') {
        // Extract JSON from the response (it might be wrapped in ```json)
        const jsonMatch = outputText.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : outputText;

        const parsedResponse = JSON.parse(jsonString);

        // The API returns 'status' field, map it to 'overallStatus'
        overallStatus = parsedResponse.status || '';
        summary = parsedResponse.summary || '';

        if (
          parsedResponse.recommendations &&
          Array.isArray(parsedResponse.recommendations)
        ) {
          recommendations = parsedResponse.recommendations.filter(
            (rec: string) => typeof rec === 'string' && rec.length > 0
          );
        }
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.error('Raw output_text:', response.output_text);
      // Fallback values will be set below
    }

    // Provide fallback values if parsing didn't work
    if (!overallStatus) {
      overallStatus = 'Good';
    }
    if (!summary) {
      summary =
        "Your dog is showing good overall health indicators based on today's assessment.";
    }
    if (recommendations.length === 0) {
      recommendations = [
        'Continue daily exercise routine',
        'Maintain consistent feeding schedule',
        'Keep up with regular grooming',
        'Schedule routine vet check-up',
      ];
    }

    return NextResponse.json({
      overallStatus,
      summary,
      recommendations,
    });
  } catch (error) {
    console.error('Error summarizing health check:', error);
    return NextResponse.json(
      { error: 'Failed to summarize health check' },
      { status: 500 }
    );
  }
}
