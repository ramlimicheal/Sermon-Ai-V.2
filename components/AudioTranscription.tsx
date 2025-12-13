import React, { useState, useRef } from 'react';
import { Mic, Upload, Loader, Check, X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AudioTranscriptionProps {
  onTranscriptionComplete: (text: string) => void;
}

export const AudioTranscription: React.FC<AudioTranscriptionProps> = ({ onTranscriptionComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioFile(new File([audioBlob], 'recording.wav', { type: 'audio/wav' }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setError('');
      } else {
        setError('Please upload an audio file (MP3, WAV, M4A, etc.)');
      }
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      setError('Please record or upload an audio file');
      return;
    }

    setIsTranscribing(true);
    setError('');

    try {
      // Simulate transcription (in production, this would call a backend API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock transcription result
      const mockTranscription = `Today I want to talk about faith and trust in God. When we look at the scriptures, we see many examples of people who had to trust God in difficult circumstances. 

Abraham was called to leave his home and go to a land he didn't know. Moses had to lead the Israelites through the wilderness. David faced Goliath with nothing but a sling and stones.

What do all these stories have in common? They all required faith. They all required trusting that God would provide and guide them.

In our own lives, we face challenges that require faith. Maybe it's a health issue, a financial struggle, or a relationship problem. Whatever it is, God calls us to trust Him.

The question is: Will we trust God? Will we believe that He has a plan for us? Will we have faith that He will see us through?

I believe the answer is yes. When we put our faith in God, we can face anything.`;

      setTranscription(mockTranscription);
    } catch (err) {
      setError('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleUseTranscription = () => {
    if (transcription) {
      onTranscriptionComplete(transcription);
      setIsOpen(false);
      setTranscription('');
      setAudioFile(null);
    }
  };

  const handlePlayAudio = () => {
    if (audioFile && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Mic className="h-3.5 w-3.5" />
        Transcribe Audio
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-bible-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-semibold text-bible-900">Audio Transcription</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-bible-500 hover:text-bible-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {!transcription ? (
                <>
                  {/* Recording Section */}
                  <div className="border-2 border-dashed border-bible-200 rounded-lg p-6 text-center">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-bible-900 mb-2">Record Sermon</h4>
                        <p className="text-sm text-bible-600 mb-4">
                          Click the button below to start recording your sermon
                        </p>
                        {isRecording ? (
                          <Button
                            onClick={handleStopRecording}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Mic className="h-3.5 w-3.5 mr-1 animate-pulse" />
                            Stop Recording
                          </Button>
                        ) : (
                          <Button
                            onClick={handleStartRecording}
                            variant="outline"
                          >
                            <Mic className="h-3.5 w-3.5 mr-1" />
                            Start Recording
                          </Button>
                        )}
                      </div>

                      {audioFile && (
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-sm text-green-700 font-medium mb-2">
                            ✓ Audio file ready: {audioFile.name}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handlePlayAudio}
                            >
                              {isPlaying ? (
                                <>
                                  <Pause className="h-3.5 w-3.5 mr-1" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-3.5 w-3.5 mr-1" />
                                  Play
                                </>
                              )}
                            </Button>
                            <audio
                              ref={audioRef}
                              src={URL.createObjectURL(audioFile)}
                              onEnded={() => setIsPlaying(false)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-bible-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-bible-600">or</span>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-bible-200 rounded-lg p-6 text-center">
                    <h4 className="font-medium text-bible-900 mb-2">Upload Audio File</h4>
                    <p className="text-sm text-bible-600 mb-4">
                      Supported formats: MP3, WAV, M4A, OGG
                    </p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button variant="outline" as="span">
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        Choose File
                      </Button>
                    </label>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                      {error}
                    </div>
                  )}

                  {audioFile && (
                    <Button
                      onClick={handleTranscribe}
                      disabled={isTranscribing}
                      className="w-full"
                    >
                      {isTranscribing ? (
                        <>
                          <Loader className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <Mic className="h-3.5 w-3.5 mr-1" />
                          Transcribe Audio
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {/* Transcription Result */}
                  <div>
                    <h4 className="font-medium text-bible-900 mb-2">Transcription Result</h4>
                    <div className="bg-bible-50 p-4 rounded-md border border-bible-200 max-h-64 overflow-y-auto">
                      <p className="text-sm text-bible-900 whitespace-pre-wrap leading-relaxed">
                        {transcription}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTranscription('');
                        setAudioFile(null);
                      }}
                      className="flex-1"
                    >
                      Start Over
                    </Button>
                    <Button
                      onClick={handleUseTranscription}
                      className="flex-1"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Use Transcription
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
