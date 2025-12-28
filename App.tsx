
import React, { useState, useCallback } from 'react';
import { Step, AppState } from './types';
import StepIndicator from './components/StepIndicator';
import * as gemini from './services/geminiService';
import { 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Send, 
  Check, 
  Sparkles, 
  Bird, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.TOPIC_INPUT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<AppState>({
    topic: '',
    everydayExample: '',
    commonExperience: '',
    personalAnecdote: '',
    specificAnecdote: '',
    generatedHook: '',
    finalHook: ''
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentStep === Step.TOPIC_INPUT) {
        if (!state.topic) throw new Error("Please enter a topic");
        const results = await gemini.generateEverydayExamples(state.topic);
        setSuggestions(results);
        setCurrentStep(Step.EVERYDAY_EXAMPLES);
      } else if (currentStep === Step.EVERYDAY_EXAMPLES) {
        if (!state.everydayExample) throw new Error("Please select or enter an example");
        const results = await gemini.generateCommonExperiences(state.everydayExample);
        setSuggestions(results);
        setCurrentStep(Step.COMMON_EXPERIENCES);
      } else if (currentStep === Step.COMMON_EXPERIENCES) {
        if (!state.commonExperience) throw new Error("Please select or enter an experience");
        const results = await gemini.generatePersonalAnecdotes(state.commonExperience);
        setSuggestions(results);
        setCurrentStep(Step.PERSONAL_ANECDOTE);
      } else if (currentStep === Step.PERSONAL_ANECDOTE) {
        if (!state.personalAnecdote) throw new Error("Please select or enter an anecdote");
        const result = await gemini.makeAnecdoteSpecific(state.personalAnecdote);
        setState(prev => ({ ...prev, specificAnecdote: result }));
        setCurrentStep(Step.SPECIFIC_ANECDOTE);
      } else if (currentStep === Step.SPECIFIC_ANECDOTE) {
        const result = await gemini.generateSampleHook(state.topic, state.specificAnecdote);
        setState(prev => ({ ...prev, generatedHook: result, finalHook: result }));
        setCurrentStep(Step.SAMPLE_HOOK);
      } else if (currentStep === Step.SAMPLE_HOOK) {
        setCurrentStep(Step.FINAL_EDIT);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const reset = () => {
    if (confirm("Reset everything and start over?")) {
      setState({
        topic: '',
        everydayExample: '',
        commonExperience: '',
        personalAnecdote: '',
        specificAnecdote: '',
        generatedHook: '',
        finalHook: ''
      });
      setCurrentStep(Step.TOPIC_INPUT);
      setSuggestions([]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.TOPIC_INPUT:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h2 className="text-blue-800 font-semibold flex items-center gap-2">
                <Bird className="w-5 h-5" /> Start your Tweetorial
              </h2>
              <p className="text-blue-700 text-sm mt-1">
                Enter the technical science or tech topic you want to explain.
              </p>
            </div>
            <input
              type="text"
              placeholder="e.g., Virtual Private Network, AJAX, CRISPR..."
              className="w-full p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg text-gray-900 bg-white"
              value={state.topic}
              onChange={(e) => setState(prev => ({ ...prev, topic: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
          </div>
        );

      case Step.EVERYDAY_EXAMPLES:
      case Step.COMMON_EXPERIENCES:
      case Step.PERSONAL_ANECDOTE:
        const labels = {
          [Step.EVERYDAY_EXAMPLES]: "Step 1: Relatable Everyday Examples",
          [Step.COMMON_EXPERIENCES]: "Step 2: Common Human Experiences",
          [Step.PERSONAL_ANECDOTE]: "Step 3: Sample Personal Anecdotes"
        };
        const descriptions = {
          [Step.EVERYDAY_EXAMPLES]: `How can we describe ${state.topic} using things people see every day?`,
          [Step.COMMON_EXPERIENCES]: `What feelings or situations do people associate with "${state.everydayExample}"?`,
          [Step.PERSONAL_ANECDOTE]: `Let's turn that experience into a quick personal story.`
        };
        const stateKeys = {
          [Step.EVERYDAY_EXAMPLES]: 'everydayExample',
          [Step.COMMON_EXPERIENCES]: 'commonExperience',
          [Step.PERSONAL_ANECDOTE]: 'personalAnecdote'
        };

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{labels[currentStep]}</h2>
              <p className="text-gray-600 mt-1">{descriptions[currentStep]}</p>
            </div>
            <div className="grid gap-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setState(prev => ({ ...prev, [stateKeys[currentStep]]: s }))}
                  className={`p-4 text-left border rounded-xl transition-all hover:bg-blue-50 hover:border-blue-300 text-gray-800 ${
                    (state as any)[stateKeys[currentStep]] === s 
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500 text-blue-900 font-medium' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Or write your own:</label>
                <textarea
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                  rows={2}
                  value={(state as any)[stateKeys[currentStep]]}
                  onChange={(e) => setState(prev => ({ ...prev, [stateKeys[currentStep]]: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case Step.SPECIFIC_ANECDOTE:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Step 4: Adding Vivid Details</h2>
              <p className="text-gray-600 mt-1">We've added some sensory details to make your story more engaging.</p>
            </div>
            <textarea
              className="w-full p-6 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg leading-relaxed shadow-inner bg-gray-50 text-gray-800"
              rows={5}
              value={state.specificAnecdote}
              onChange={(e) => setState(prev => ({ ...prev, specificAnecdote: e.target.value }))}
            />
          </div>
        );

      case Step.SAMPLE_HOOK:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Step 5: The Generated Hook</h2>
              <p className="text-gray-600 mt-1">Here is a draft hook that is jargon-free, relatable, and sparks curiosity.</p>
            </div>
            <div className="bg-white border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <Bird className="absolute bottom-4 right-4 text-blue-100 w-16 h-16 -z-0" />
              <textarea
                className="w-full bg-transparent text-xl font-medium text-gray-800 resize-none outline-none relative z-10"
                rows={6}
                value={state.finalHook}
                onChange={(e) => setState(prev => ({ ...prev, finalHook: e.target.value }))}
              />
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3">
              <Sparkles className="text-yellow-600 w-5 h-5 flex-shrink-0" />
              <p className="text-yellow-700 text-sm italic">
                Pro-tip: People love reading about personal failures or surprising discoveries. 
                Don't be afraid to make the anecdote sound even more vulnerable or exciting!
              </p>
            </div>
          </div>
        );

      case Step.FINAL_EDIT:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Tweetorial Hook is Ready!</h2>
              <p className="text-gray-500">Copy this as your first tweet to launch your thread.</p>
            </div>

            <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-xl p-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <div className="font-bold text-gray-900">You</div>
                  <div className="text-gray-500 text-sm">@science_expert</div>
                </div>
              </div>
              <p className="text-2xl text-gray-800 leading-snug whitespace-pre-wrap font-medium">
                {state.finalHook}
              </p>
              <div className="mt-6 flex gap-6 text-gray-400 border-t pt-4">
                <span className="flex items-center gap-1 text-sm"><RotateCcw className="w-4 h-4" /> 12</span>
                <span className="flex items-center gap-1 text-sm"><Check className="w-4 h-4" /> 45</span>
                <span className="flex items-center gap-1 text-sm"><Send className="w-4 h-4" /> Share</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(state.finalHook);
                  alert("Copied to clipboard!");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Start New Project
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20">
      {/* Header */}
      <header className="w-full bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bird className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">Tweetorial</h1>
              <span className="text-xs text-blue-600 font-bold uppercase tracking-widest">Hook Incubator</span>
            </div>
          </div>
          {currentStep > 0 && currentStep < Step.FINAL_EDIT && (
            <button
              onClick={reset}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Progress */}
      <div className="w-full bg-white border-b mb-8 shadow-sm">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-sm border p-8 relative min-h-[400px]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium animate-pulse">Consulting the digital muse...</p>
            </div>
          ) : null}

          <div className={`${loading ? 'opacity-20 pointer-events-none' : ''} transition-opacity duration-300`}>
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentStep < Step.FINAL_EDIT && (
          <div className="mt-8 flex justify-between items-center px-2">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${
                currentStep === 0 ? 'invisible' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {currentStep === Step.SAMPLE_HOOK ? 'Finish' : 'Next'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-gray-400 text-sm px-4">
        <p>Based on "Tweetorial Hooks: Generative AI Tools to Motivate Science on Social Media"</p>
        <p className="mt-1 opacity-60">Created by Columbia University & Barnard College researchers.</p>
      </footer>
    </div>
  );
};

export default App;
