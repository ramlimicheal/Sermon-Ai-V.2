import React, { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  BookHeart, 
  Users, 
  Mail, 
  Copy, 
  Check, 
  Loader,
  Twitter,
  Instagram,
  Facebook,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Language } from '@/types';

interface ContentRepurposerProps {
  sermonTitle: string;
  scripture: string;
  sermonContent: string;
  language: Language;
}

interface GeneratedContent {
  socialPosts: {
    twitter: string[];
    instagram: string;
    facebook: string;
  };
  devotional: {
    title: string;
    scripture: string;
    reflection: string;
    prayer: string;
    actionStep: string;
  };
  smallGroupQuestions: {
    iceBreaker: string;
    discussionQuestions: string[];
    applicationQuestion: string;
    prayerFocus: string;
  };
  emailNewsletter: {
    subject: string;
    preview: string;
    body: string;
  };
}

type ContentType = 'social' | 'devotional' | 'smallGroup' | 'email';

export const ContentRepurposer: React.FC<ContentRepurposerProps> = ({
  sermonTitle,
  scripture,
  sermonContent,
  language
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ContentType>('social');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['twitter']));

  const handleGenerate = async () => {
    if (!sermonContent.trim()) {
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockContent: GeneratedContent = {
        socialPosts: {
          twitter: [
            `"${getKeyQuote(sermonContent)}" - From today's message on ${scripture}. What truth is God speaking to your heart? #SermonNotes #Faith`,
            `3 things I learned from ${scripture} today:\n\n1. God's love is unconditional\n2. Grace transforms everything\n3. We're called to share this hope\n\nWhich resonates with you? #ChurchLife`,
            `Sunday reminder: ${getKeyInsight(sermonContent)} 🙏\n\n${scripture}`,
          ],
          instagram: `📖 ${sermonTitle}\n\nToday we explored ${scripture} and discovered powerful truths about God's faithfulness.\n\n${getKeyInsight(sermonContent)}\n\nKey takeaway: God meets us exactly where we are and transforms us into who He created us to be.\n\nDouble tap if this speaks to you! 💛\n\n#SundaySermon #ChurchFamily #Faith #BibleStudy #ChristianLife #Worship #GodIsGood #SpiritualGrowth`,
          facebook: `🎯 Sermon Recap: "${sermonTitle}"\n\nThis Sunday we dove deep into ${scripture}.\n\n${getKeyInsight(sermonContent)}\n\nThree questions to reflect on this week:\n• How is God calling you to trust Him more?\n• What area of your life needs His transformation?\n• Who can you share this hope with?\n\nMissed the service? Watch the full message on our YouTube channel (link in bio).\n\n#SundayMessage #ChurchCommunity`
        },
        devotional: {
          title: `Daily Devotional: ${sermonTitle}`,
          scripture: scripture,
          reflection: `Today's passage from ${scripture} reminds us of a profound truth: ${getKeyInsight(sermonContent)}\n\nAs we meditate on these words, we're invited to consider how God is working in our own lives. The same God who spoke through these ancient texts continues to speak to us today.\n\nTake a moment to sit with this truth. What is God saying to you personally through this passage?`,
          prayer: `Heavenly Father, thank You for Your Word that guides and transforms us. As we reflect on ${scripture}, open our hearts to receive what You want to teach us. Help us to not just be hearers of Your Word, but doers. Give us the courage to apply these truths in our daily lives. In Jesus' name, Amen.`,
          actionStep: `This week, identify one specific way you can apply the message from ${scripture} in your daily life. Write it down and share it with someone who can encourage you and hold you accountable.`
        },
        smallGroupQuestions: {
          iceBreaker: `Share a time when you experienced unexpected grace or kindness from someone. How did it impact you?`,
          discussionQuestions: [
            `Read ${scripture} together. What stands out to you most in this passage?`,
            `How does this passage challenge or comfort you in your current season of life?`,
            `What does this scripture reveal about God's character?`,
            `How have you seen the truth of this passage play out in your own life or the lives of others?`,
            `What obstacles might prevent us from fully embracing the message of this text?`,
            `How can we support each other in applying these truths this week?`
          ],
          applicationQuestion: `Based on our discussion, what is one specific action step you will take this week to live out the truth of ${scripture}?`,
          prayerFocus: `Spend time praying for each other, specifically asking God to help each person apply what they've learned. Pray for opportunities to share this truth with others.`
        },
        emailNewsletter: {
          subject: `This Week's Message: ${sermonTitle}`,
          preview: `Discover what ${scripture} teaches us about God's faithfulness...`,
          body: `Dear Church Family,\n\nThis Sunday we explored ${scripture} together, and what a powerful time it was!\n\n**Key Insight:**\n${getKeyInsight(sermonContent)}\n\n**Reflection Questions:**\n• How is God speaking to you through this passage?\n• What step of faith is He calling you to take?\n• Who in your life needs to hear this message?\n\n**This Week's Challenge:**\nTake 10 minutes each day to meditate on ${scripture}. Journal what God reveals to you.\n\n**Upcoming Events:**\n• Small Groups meet Wednesday at 7pm\n• Prayer Night this Friday\n• Community Outreach next Saturday\n\nWe're so grateful for each of you. See you next Sunday!\n\nIn Christ,\nPastor`
        }
      };

      setGeneratedContent(mockContent);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, itemId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const tabs = [
    { id: 'social' as ContentType, label: 'Social Media', icon: Share2 },
    { id: 'devotional' as ContentType, label: 'Devotional', icon: BookHeart },
    { id: 'smallGroup' as ContentType, label: 'Small Group', icon: Users },
    { id: 'email' as ContentType, label: 'Newsletter', icon: Mail },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Repurpose Content
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-semibold text-stone-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Content Repurposer
                </h2>
                <p className="text-sm text-stone-500 mt-0.5">Transform your sermon into multiple content formats</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-2"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-200 shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-stone-900 border-b-2 border-stone-900'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!generatedContent ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-900 mb-2">Ready to Multiply Your Message</h3>
                  <p className="text-stone-500 mb-6 max-w-md mx-auto">
                    Transform your sermon into social media posts, devotionals, small group questions, and email newsletters with one click.
                  </p>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !sermonContent.trim()}
                    className="px-8"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate All Content
                      </>
                    )}
                  </Button>
                  {!sermonContent.trim() && (
                    <p className="text-sm text-amber-600 mt-4">Add sermon notes first to generate content</p>
                  )}
                </div>
              ) : (
                <>
                  {/* Social Media Tab */}
                  {activeTab === 'social' && (
                    <div className="space-y-4">
                      {/* Twitter */}
                      <div className="border border-stone-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('twitter')}
                          className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Twitter className="h-5 w-5 text-sky-500" />
                            <span className="font-medium text-stone-900">Twitter/X Posts</span>
                            <span className="text-xs text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                              {generatedContent.socialPosts.twitter.length} posts
                            </span>
                          </div>
                          {expandedSections.has('twitter') ? (
                            <ChevronUp className="h-5 w-5 text-stone-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-stone-400" />
                          )}
                        </button>
                        {expandedSections.has('twitter') && (
                          <div className="p-4 space-y-3">
                            {generatedContent.socialPosts.twitter.map((post, idx) => (
                              <div key={idx} className="bg-stone-50 rounded-lg p-4 relative group">
                                <p className="text-sm text-stone-700 whitespace-pre-wrap pr-10">{post}</p>
                                <button
                                  onClick={() => handleCopy(post, `twitter-${idx}`)}
                                  className="absolute top-3 right-3 p-2 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  {copiedItem === `twitter-${idx}` ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4 text-stone-400" />
                                  )}
                                </button>
                                <p className="text-xs text-stone-400 mt-2">{post.length}/280 characters</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Instagram */}
                      <div className="border border-stone-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('instagram')}
                          className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Instagram className="h-5 w-5 text-pink-500" />
                            <span className="font-medium text-stone-900">Instagram Caption</span>
                          </div>
                          {expandedSections.has('instagram') ? (
                            <ChevronUp className="h-5 w-5 text-stone-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-stone-400" />
                          )}
                        </button>
                        {expandedSections.has('instagram') && (
                          <div className="p-4">
                            <div className="bg-stone-50 rounded-lg p-4 relative group">
                              <p className="text-sm text-stone-700 whitespace-pre-wrap pr-10">
                                {generatedContent.socialPosts.instagram}
                              </p>
                              <button
                                onClick={() => handleCopy(generatedContent.socialPosts.instagram, 'instagram')}
                                className="absolute top-3 right-3 p-2 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {copiedItem === 'instagram' ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4 text-stone-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Facebook */}
                      <div className="border border-stone-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('facebook')}
                          className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Facebook className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-stone-900">Facebook Post</span>
                          </div>
                          {expandedSections.has('facebook') ? (
                            <ChevronUp className="h-5 w-5 text-stone-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-stone-400" />
                          )}
                        </button>
                        {expandedSections.has('facebook') && (
                          <div className="p-4">
                            <div className="bg-stone-50 rounded-lg p-4 relative group">
                              <p className="text-sm text-stone-700 whitespace-pre-wrap pr-10">
                                {generatedContent.socialPosts.facebook}
                              </p>
                              <button
                                onClick={() => handleCopy(generatedContent.socialPosts.facebook, 'facebook')}
                                className="absolute top-3 right-3 p-2 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {copiedItem === 'facebook' ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4 text-stone-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Devotional Tab */}
                  {activeTab === 'devotional' && (
                    <div className="space-y-6">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
                          {generatedContent.devotional.title}
                        </h3>
                        <p className="text-sm text-amber-700 font-medium">{generatedContent.devotional.scripture}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-stone-900 mb-2">Reflection</h4>
                        <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                          {generatedContent.devotional.reflection}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-stone-900 mb-2">Prayer</h4>
                        <p className="text-stone-600 leading-relaxed italic">
                          {generatedContent.devotional.prayer}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-stone-900 mb-2">Action Step</h4>
                        <p className="text-stone-600 leading-relaxed">
                          {generatedContent.devotional.actionStep}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handleCopy(
                          `${generatedContent.devotional.title}\n\n${generatedContent.devotional.scripture}\n\nReflection:\n${generatedContent.devotional.reflection}\n\nPrayer:\n${generatedContent.devotional.prayer}\n\nAction Step:\n${generatedContent.devotional.actionStep}`,
                          'devotional'
                        )}
                        className="w-full"
                      >
                        {copiedItem === 'devotional' ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Full Devotional
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Small Group Tab */}
                  {activeTab === 'smallGroup' && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Ice Breaker</h4>
                        <p className="text-green-800">{generatedContent.smallGroupQuestions.iceBreaker}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-stone-900 mb-3">Discussion Questions</h4>
                        <ol className="space-y-3">
                          {generatedContent.smallGroupQuestions.discussionQuestions.map((q, idx) => (
                            <li key={idx} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-600">
                                {idx + 1}
                              </span>
                              <p className="text-stone-600 pt-0.5">{q}</p>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Application Question</h4>
                        <p className="text-blue-800">{generatedContent.smallGroupQuestions.applicationQuestion}</p>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-2">Prayer Focus</h4>
                        <p className="text-purple-800">{generatedContent.smallGroupQuestions.prayerFocus}</p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handleCopy(
                          `Small Group Discussion Guide\n\nIce Breaker:\n${generatedContent.smallGroupQuestions.iceBreaker}\n\nDiscussion Questions:\n${generatedContent.smallGroupQuestions.discussionQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nApplication:\n${generatedContent.smallGroupQuestions.applicationQuestion}\n\nPrayer Focus:\n${generatedContent.smallGroupQuestions.prayerFocus}`,
                          'smallGroup'
                        )}
                        className="w-full"
                      >
                        {copiedItem === 'smallGroup' ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Discussion Guide
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Email Tab */}
                  {activeTab === 'email' && (
                    <div className="space-y-4">
                      <div className="border border-stone-200 rounded-lg overflow-hidden">
                        <div className="bg-stone-50 px-4 py-3 border-b border-stone-200">
                          <p className="text-xs text-stone-500 mb-1">Subject Line</p>
                          <p className="font-medium text-stone-900">{generatedContent.emailNewsletter.subject}</p>
                        </div>
                        <div className="bg-stone-50 px-4 py-3 border-b border-stone-200">
                          <p className="text-xs text-stone-500 mb-1">Preview Text</p>
                          <p className="text-sm text-stone-600">{generatedContent.emailNewsletter.preview}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-stone-500 mb-2">Email Body</p>
                          <div className="bg-white border border-stone-200 rounded-lg p-4">
                            <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                              {generatedContent.emailNewsletter.body}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handleCopy(
                          `Subject: ${generatedContent.emailNewsletter.subject}\n\n${generatedContent.emailNewsletter.body}`,
                          'email'
                        )}
                        className="w-full"
                      >
                        {copiedItem === 'email' ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Newsletter
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {generatedContent && (
              <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between shrink-0 bg-stone-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Regenerate All
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

function getKeyQuote(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20 && s.trim().length < 100);
  return sentences[0]?.trim() || 'God\'s love transforms everything';
}

function getKeyInsight(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
  return sentences[Math.min(1, sentences.length - 1)]?.trim() || 'When we trust in God\'s plan, we find peace that surpasses understanding.';
}
