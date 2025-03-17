import { languages } from "./supported-languages"

export async function executeCode(language: string, sourceCode: string) {
  try {
    const languageId = languages.find(lang => lang.value === language)?.id || 63;
    
    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode,
        stdin: "",
        base64_encoded: false
      }),
    });

    const { token } = await response.json();
    
    let statusResponse;
    let result;
    
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      statusResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      });
      
      result = await statusResponse.json();
    } while (result.status?.id <= 2);
    
    const output = result.stdout || "";
    const error = result.stderr || "";
    const compile_output = result.compile_output || "";
    
    return { 
      success: !error && !compile_output,
      output: output || compile_output || error || "Program executed with no output",
      executionTime: result.time, 
      memory: result.memory 
    };
  } catch (error) {
    return { 
      success: false, 
      output: `Error connecting to Judge0 API: ${(error as Error).message}`,
      executionTime: null,
      memory: null
    };
  }
}