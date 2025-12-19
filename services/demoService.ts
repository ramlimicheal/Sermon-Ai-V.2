import { Citation, generateMockCitations } from '@/components/TrustLayer';

export interface DemoCommentary {
  content: string;
  citations: Citation[];
}

export interface DemoIllustration {
  title: string;
  sourceType: 'Historical' | 'Literature' | 'Scientific' | 'Modern';
  content: string;
  connection: string;
}

export interface DemoOutlinePoint {
  title: string;
  scripture?: string;
  content: string;
  application?: string;
}

export interface DemoOutline {
  title: string;
  introduction: string;
  points: DemoOutlinePoint[];
  conclusion: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDemoCommentary = async (scripture: string): Promise<DemoCommentary> => {
  await delay(800);
  
  const commentaries: Record<string, DemoCommentary> = {
    default: {
      content: `## Historical Context

This passage was written during a pivotal moment in biblical history. The author addresses a community facing significant challenges, offering both theological insight and practical guidance for faithful living.

## Exegetical Insights

The key Greek/Hebrew terms in this passage reveal deeper layers of meaning:

- **Primary term**: Carries connotations of covenant faithfulness and divine commitment
- **Secondary term**: Emphasizes the transformative nature of God's work in believers
- **Action verb**: Indicates ongoing, continuous action rather than a one-time event

## Theological Perspectives

**Augustine** emphasized the grace dimension of this text, seeing it as evidence of God's prevenient work in human hearts.

**Luther** found here a powerful expression of justification by faith, noting how the passage undermines any notion of human merit.

**Calvin** highlighted the sovereignty of God while also affirming human responsibility in response to divine initiative.

**Modern scholars** like N.T. Wright connect this passage to the broader narrative of God's covenant faithfulness to Israel and the world.

## The Nature of God

This passage reveals God as:
- **Faithful**: Keeping promises across generations
- **Gracious**: Acting out of love rather than obligation
- **Powerful**: Able to accomplish what He purposes
- **Personal**: Engaging intimately with His people

## Key Themes

1. **Divine Initiative**: God acts first; we respond
2. **Covenant Relationship**: Not mere contract but intimate bond
3. **Transformative Grace**: God's work changes us from within
4. **Eschatological Hope**: Present realities point to future fulfillment`,
      citations: generateMockCitations(scripture),
    },
  };

  return commentaries.default;
};

export const getDemoIllustrations = async (scripture: string): Promise<DemoIllustration[]> => {
  await delay(600);
  
  return [
    {
      title: "The Lighthouse Keeper's Faithfulness",
      sourceType: 'Historical',
      content: "In 1856, lighthouse keeper Abbie Burgess, just 17 years old, kept the Matinicus Rock lighthouse burning for four weeks during a terrible storm while her father was stranded on the mainland. Despite dwindling supplies and crashing waves that flooded the lighthouse, she never let the light go out. Ships depended on that light for safe passage.",
      connection: "Like Abbie's unwavering commitment to keeping the light burning, God's faithfulness never wavers regardless of the storms around us. We can trust His light to guide us through the darkest nights.",
    },
    {
      title: "The Velveteen Rabbit's Transformation",
      sourceType: 'Literature',
      content: "In Margery Williams' beloved story, the Velveteen Rabbit asks the Skin Horse what it means to be 'Real.' The Skin Horse explains that becoming real happens through being loved—it takes a long time, and by the time you're Real, most of your hair has been loved off. But once you're Real, you can't become unreal again.",
      connection: "This mirrors the transformative work of God's love in our lives. We become 'real'—our true selves—not through our own efforts but through being loved by God. The process may be long and sometimes painful, but the result is eternal.",
    },
    {
      title: "The Monarch Butterfly's Journey",
      sourceType: 'Scientific',
      content: "Monarch butterflies migrate up to 3,000 miles from Canada to Mexico, a journey no single butterfly completes. It takes four generations to make the round trip. Yet somehow, butterflies that have never made the journey know exactly where to go, guided by an internal compass that scientists still don't fully understand.",
      connection: "Like the monarchs, we are part of a larger story that spans generations. God has placed within us an internal compass—a longing for home, for Him—that guides us even when we don't fully understand the journey.",
    },
  ];
};

export const getDemoOutline = async (scripture: string, style: string = 'Expository'): Promise<DemoOutline> => {
  await delay(700);
  
  return {
    title: `Finding Hope in ${scripture}`,
    introduction: `Open with a story about searching for hope in difficult times. Transition to how this passage offers us a foundation for unshakeable hope. Read the passage together and set the context for our exploration.`,
    points: [
      {
        title: "The Promise We Can Trust",
        scripture: scripture,
        content: "Examine the nature of God's promises in this text. Unlike human promises that can be broken, God's word stands firm. Explore the Hebrew/Greek concept of covenant faithfulness.",
        application: "This week, identify one area where you're struggling to trust God's promises. Write it down and commit to praying about it daily.",
      },
      {
        title: "The Power That Transforms",
        content: "Look at how God's power works in and through us. This isn't about our strength but His. The same power that raised Christ from the dead is at work in us.",
        application: "Where do you need God's transforming power in your life right now? Share with a trusted friend and ask them to pray with you.",
      },
      {
        title: "The Purpose That Guides",
        content: "Discover the bigger picture of what God is doing. We're not random actors on a cosmic stage but beloved children with a divine purpose. Our lives have meaning because they're connected to His story.",
        application: "Reflect on how your daily activities connect to God's larger purposes. How might you live differently this week with eternity in view?",
      },
    ],
    conclusion: `Bring the threads together: God's trustworthy promises, His transforming power, and His guiding purpose all point us to hope. Close with a prayer of commitment and an invitation to respond.`,
  };
};

export const getDemoCrossReferences = async (scripture: string): Promise<any[]> => {
  await delay(500);
  
  return [
    {
      reference: "Romans 8:28",
      connection: "Thematic parallel on God's sovereign purpose working for good",
      type: "thematic",
    },
    {
      reference: "Jeremiah 29:11",
      connection: "Old Testament foundation for God's plans of hope and future",
      type: "prophetic",
    },
    {
      reference: "Hebrews 11:1",
      connection: "Definition of faith that connects to the trust theme",
      type: "theological",
    },
    {
      reference: "Psalm 23",
      connection: "Poetic expression of God's faithful guidance and provision",
      type: "thematic",
    },
    {
      reference: "Isaiah 40:31",
      connection: "Promise of renewed strength for those who hope in the Lord",
      type: "prophetic",
    },
  ];
};

export const getDemoApplications = async (scripture: string): Promise<any[]> => {
  await delay(600);
  
  return [
    {
      audience: "Youth",
      application: "In a world of social media comparison and peer pressure, this passage reminds you that your identity and worth come from God, not from likes or followers.",
      actionStep: "This week, spend 10 minutes each morning reading this passage before checking your phone. Notice how it changes your perspective on the day.",
    },
    {
      audience: "Families",
      application: "As parents, we often worry about our children's future. This passage invites us to trust God's faithfulness across generations.",
      actionStep: "Have a family discussion about one way you've seen God's faithfulness. Create a 'faithfulness jar' where family members can add notes about answered prayers.",
    },
    {
      audience: "Singles",
      application: "Whether single by choice or circumstance, this passage affirms that your completeness comes from God, not from a relationship status.",
      actionStep: "Write a letter to yourself about the hopes and dreams you're trusting God with. Seal it and open it in one year to see how God has worked.",
    },
    {
      audience: "Professionals",
      application: "In the pressure of deadlines and performance metrics, remember that your ultimate purpose transcends your job title.",
      actionStep: "Before your next big meeting or project, pray this passage over your work. Ask God to use your professional skills for His purposes.",
    },
    {
      audience: "Seniors",
      application: "Looking back on life's journey, this passage celebrates God's faithfulness through every season and points to the hope of eternity.",
      actionStep: "Share a story of God's faithfulness with a younger person this week. Your testimony is a gift to the next generation.",
    },
  ];
};

export const getDemoHistoricalContext = async (scripture: string): Promise<any> => {
  await delay(500);
  
  return {
    timeperiod: "1st Century AD (approximately 50-60 AD)",
    culturalBackground: "Written to a community living under Roman occupation, navigating the tension between their faith and the surrounding Greco-Roman culture. Honor-shame dynamics heavily influenced social interactions.",
    geographicalSetting: "The Mediterranean world, likely addressed to communities in major urban centers along Roman trade routes. These cities were cosmopolitan, with diverse populations and competing religious claims.",
    politicalContext: "The Pax Romana provided stability but also demanded emperor worship. Christians faced suspicion as a new religious movement that refused to participate in civic religion.",
    religiousContext: "Judaism provided the theological foundation, but the early church was working out its identity as distinct from the synagogue. Gentile converts brought their own questions about how to live faithfully.",
  };
};

export const getDemoGreekHebrew = async (scripture: string): Promise<any[]> => {
  await delay(600);
  
  return [
    {
      word: "ἀγάπη",
      transliteration: "agapē",
      strongsNumber: "G26",
      definition: "Unconditional, self-sacrificing love; the highest form of love that seeks the good of others regardless of their response",
      usage: "Used here to describe God's initiating love that precedes and enables human response",
    },
    {
      word: "πίστις",
      transliteration: "pistis",
      strongsNumber: "G4102",
      definition: "Faith, trust, confidence; includes both belief and faithfulness/loyalty",
      usage: "Emphasizes not just intellectual assent but wholehearted trust and commitment",
    },
    {
      word: "χάρις",
      transliteration: "charis",
      strongsNumber: "G5485",
      definition: "Grace, unmerited favor; God's generous gift that cannot be earned",
      usage: "The foundation of salvation and the ongoing empowerment for Christian living",
    },
  ];
};

export const isDemoMode = (): boolean => {
  const apiKey = process.env.API_KEY || '';
  return !apiKey || apiKey.length < 10;
};

export const getDemoMessage = (): string => {
  return "You're viewing demo content. Connect your AI to unlock live, personalized results.";
};
