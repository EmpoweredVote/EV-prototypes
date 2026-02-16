/**
 * Clip data for Fallacy Finders
 *
 * Each clip represents a segment of a public political debate with tagged
 * fallacy instances that players need to identify. Transcripts and fallacy
 * timestamps are hand-authored to model realistic civic discourse.
 *
 * YouTube IDs are placeholders for the prototype -- actual debate footage
 * will be sourced from public domain recordings (C-SPAN, government sites,
 * official debate uploads) before production launch.
 */

export const CLIPS = [
  // -----------------------------------------------------------------------
  // CLIP 1 -- Indiana Gubernatorial Debate: Economy
  // -----------------------------------------------------------------------
  {
    id: 'indiana_gov_2024_01',
    title: 'Indiana Gubernatorial Debate - Economy',
    description:
      'Candidates discuss economic policy, job creation, and workforce development in Indiana.',
    youtubeId: 'dQw4w9WgXcQ', // placeholder
    duration: 150, // seconds
    speakers: [
      { id: 'mccormick', name: 'McCormick', party: 'Democrat', color: '#3b82f6' },
      { id: 'braun', name: 'Braun', party: 'Republican', color: '#ef4444' },
      { id: 'rainwater', name: 'Rainwater', party: 'Libertarian', color: '#f59e0b' },
    ],
    transcript: [
      { time: 0, speaker: 'Moderator', text: "Welcome to tonight's gubernatorial debate. Our first topic is the economy. Each candidate will have ninety seconds to outline their economic plan for Indiana. Ms. McCormick, we'll start with you." },
      { time: 8, speaker: 'McCormick', text: "Thank you. For too long, Republican control has meant ignoring the needs of working families across Indiana. Their only priority is corporate tax breaks while our schools and roads crumble." },
      { time: 22, speaker: 'McCormick', text: "My plan invests directly in communities -- workforce training, small business grants, and broadband expansion to every county." },
      { time: 33, speaker: 'Moderator', text: "Senator Braun, your response." },
      { time: 35, speaker: 'Braun', text: "Well, my opponent has never run a business, never met a payroll. How can someone who has spent her entire career in government understand what it takes to create jobs?" },
      { time: 48, speaker: 'Braun', text: "Under my leadership, we cut regulations and Indiana added 85,000 jobs. My neighbor in Jasper started a small shop and now employs twenty people -- that's what lower taxes do." },
      { time: 63, speaker: 'Moderator', text: "Mr. Rainwater." },
      { time: 65, speaker: 'Rainwater', text: "Both of my opponents are offering you the same tired choice -- big government spending or big corporate giveaways. There is no middle ground with either of them. Only a Libertarian approach can truly free Indiana's economy." },
      { time: 80, speaker: 'Moderator', text: "Ms. McCormick, a follow-up. How do you respond to the charge that government spending crowds out private investment?" },
      { time: 85, speaker: 'McCormick', text: "You know, Senator Braun talks about cutting regulations, but wasn't he the one who voted to subsidize his own industry? Maybe he should explain that before lecturing the rest of us about free markets." },
      { time: 100, speaker: 'Braun', text: "That subsidy created thousands of jobs -- but let me be clear: if we raise taxes even a little, businesses will flee Indiana. First they cut hours, then they close factories, and before you know it we'll be the next Detroit." },
      { time: 118, speaker: 'Rainwater', text: "Seventy-three percent of Hoosiers in our latest poll say they want lower taxes. The people have spoken. That should settle this debate." },
      { time: 130, speaker: 'Moderator', text: "Thank you. We'll move on to education after a brief pause." },
    ],
    speakerTimeline: [
      { start: 0, end: 8, speaker: 'moderator' },
      { start: 8, end: 32, speaker: 'mccormick' },
      { start: 33, end: 35, speaker: 'moderator' },
      { start: 35, end: 62, speaker: 'braun' },
      { start: 63, end: 65, speaker: 'moderator' },
      { start: 65, end: 79, speaker: 'rainwater' },
      { start: 80, end: 85, speaker: 'moderator' },
      { start: 85, end: 99, speaker: 'mccormick' },
      { start: 100, end: 117, speaker: 'braun' },
      { start: 118, end: 129, speaker: 'rainwater' },
      { start: 130, end: 150, speaker: 'moderator' },
    ],
    fallacies: [
      {
        id: 'c1_f1',
        type: 'strawman',
        startTime: 8,
        endTime: 21,
        speaker: 'mccormick',
        confidence: 'high',
        quote: "Republican control has meant ignoring the needs of working families... Their only priority is corporate tax breaks while our schools and roads crumble.",
        explanation:
          "The speaker reduces the opposing party's entire governing agenda to a single motive -- 'their only priority is corporate tax breaks' -- and then attacks that simplified version. In reality, the Republican platform includes positions on education, infrastructure, and many other issues. By constructing a one-dimensional caricature, the speaker avoids engaging with actual policy proposals.",
        teachingTip:
          "Listen for absolutes like 'their only goal' or 'all they care about.' When someone reduces a complex position to one extreme element, they may be building a Straw Man that is easier to knock down than the real argument.",
      },
      {
        id: 'c1_f2',
        type: 'ad_hominem',
        startTime: 35,
        endTime: 47,
        speaker: 'braun',
        confidence: 'high',
        quote: "My opponent has never run a business, never met a payroll. How can someone who has spent her entire career in government understand what it takes to create jobs?",
        explanation:
          "Instead of addressing McCormick's economic proposals on their merits, Braun attacks her professional background. Whether or not she has run a business has no bearing on whether her policy ideas are sound. This diverts attention from the substance of the debate to the person making the argument.",
        teachingTip:
          "When a speaker shifts from 'here is why their plan won't work' to 'here is why THEY can't be trusted,' that is usually an Ad Hominem. The person's background does not determine whether their logic is valid.",
      },
      {
        id: 'c1_f3',
        type: 'anecdotal',
        startTime: 48,
        endTime: 62,
        speaker: 'braun',
        confidence: 'medium',
        quote: "My neighbor in Jasper started a small shop and now employs twenty people -- that's what lower taxes do.",
        explanation:
          "One person's success story does not prove that lower taxes universally create jobs. While the anecdote is compelling, it substitutes a single data point for systematic economic evidence. Many factors beyond tax policy -- location, industry, timing -- could explain why one business succeeded.",
        teachingTip:
          "Personal stories are persuasive but not proof. Ask: 'Does one example establish a pattern?' If the speaker offers a single case to justify a sweeping claim, that is Anecdotal reasoning.",
      },
      {
        id: 'c1_f4',
        type: 'black_or_white',
        startTime: 65,
        endTime: 79,
        speaker: 'rainwater',
        confidence: 'high',
        quote: "Both of my opponents are offering you the same tired choice -- big government spending or big corporate giveaways. There is no middle ground with either of them.",
        explanation:
          "Rainwater frames the debate as only two options -- big spending versus big giveaways -- and dismisses both, positioning his platform as the sole alternative. In reality, there is a wide spectrum of economic approaches. By collapsing the range of options into two extremes, he makes his position appear like the only reasonable path.",
        teachingTip:
          "When someone says 'it is either A or B,' ask yourself whether options C, D, or E might also exist. Politicians often use False Dilemmas to make their opponent's position seem extreme while their own seems moderate.",
      },
      {
        id: 'c1_f5',
        type: 'tu_quoque',
        startTime: 85,
        endTime: 99,
        speaker: 'mccormick',
        confidence: 'high',
        quote: "Wasn't he the one who voted to subsidize his own industry? Maybe he should explain that before lecturing the rest of us about free markets.",
        explanation:
          "Rather than responding to the substance of Braun's argument about government spending, McCormick deflects by pointing out his inconsistency -- he benefited from subsidies while advocating free markets. While hypocrisy is worth noting, it does not address whether the original argument about spending is correct. 'You do it too' is not a rebuttal.",
        teachingTip:
          "Tu Quoque means 'you too' in Latin. When someone deflects criticism by pointing out the accuser's similar behavior, the original argument goes unanswered. Watch for 'but YOU did the same thing' responses.",
      },
      {
        id: 'c1_f6',
        type: 'slippery_slope',
        startTime: 100,
        endTime: 117,
        speaker: 'braun',
        confidence: 'high',
        quote: "If we raise taxes even a little, businesses will flee Indiana. First they cut hours, then they close factories, and before you know it we'll be the next Detroit.",
        explanation:
          "Braun presents a chain of escalating consequences -- a small tax increase leads to hour cuts, then factory closures, then total economic collapse comparable to Detroit -- without evidence that each step inevitably follows from the last. This exaggerates the likely impact of a modest policy change by treating a worst-case cascade as certain.",
        teachingTip:
          "Slippery Slope arguments follow the pattern 'if A, then B, then C, then catastrophe.' The key question is: does the speaker provide evidence that each step NECESSARILY leads to the next? Without that, they are just stringing together fears.",
      },
      {
        id: 'c1_f7',
        type: 'bandwagon',
        startTime: 118,
        endTime: 129,
        speaker: 'rainwater',
        confidence: 'high',
        quote: "Seventy-three percent of Hoosiers in our latest poll say they want lower taxes. The people have spoken. That should settle this debate.",
        explanation:
          "Rainwater argues that because a majority of people hold a particular opinion, the debate is resolved. But popular opinion does not determine whether a policy is economically sound. Seventy-three percent wanting something does not make it the best course of action -- policies must be evaluated on evidence, not polling numbers.",
        teachingTip:
          "Bandwagon appeals use phrases like 'everyone agrees,' 'the majority wants,' or 'the people have spoken.' Popularity does not equal correctness. Ask: 'Is this true because many believe it, or do many believe it because it is true?'",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // CLIP 2 -- Indiana Gubernatorial Debate: Education
  // -----------------------------------------------------------------------
  {
    id: 'indiana_gov_2024_02',
    title: 'Indiana Gubernatorial Debate - Education',
    description:
      'Candidates debate school funding, voucher programs, and teacher retention in Indiana.',
    youtubeId: 'dQw4w9WgXcQ', // placeholder
    duration: 140, // seconds
    speakers: [
      { id: 'mccormick', name: 'McCormick', party: 'Democrat', color: '#3b82f6' },
      { id: 'braun', name: 'Braun', party: 'Republican', color: '#ef4444' },
      { id: 'rainwater', name: 'Rainwater', party: 'Libertarian', color: '#f59e0b' },
    ],
    transcript: [
      { time: 0, speaker: 'Moderator', text: "Let's turn to education. Indiana ranks 38th in teacher pay nationally. Ms. McCormick, what's your plan to address teacher shortages?" },
      { time: 9, speaker: 'McCormick', text: "Thank you. The answer is straightforward -- we must invest in our public schools. Dr. Patricia Alvarez, the dean of education at IU, has said that fully funding public schools is the single most important thing we can do. If the experts say it, we should listen." },
      { time: 25, speaker: 'McCormick', text: "Senator Braun's voucher program is just a scheme to defund public schools so his wealthy donors can profit from private academies." },
      { time: 35, speaker: 'Moderator', text: "Senator Braun." },
      { time: 37, speaker: 'Braun', text: "My opponent wants to throw more money at a broken system. We've been increasing education budgets for twenty years and test scores keep declining. More money clearly doesn't fix bad schools." },
      { time: 50, speaker: 'Braun', text: "School choice works. I talked to a mother in Fort Wayne whose daughter went from failing in public school to thriving at a charter school. That's the power of competition." },
      { time: 63, speaker: 'Moderator', text: "Mr. Rainwater, your thoughts on school choice?" },
      { time: 66, speaker: 'Rainwater', text: "Let me ask both of my opponents this: why do you support a system that traps children in failing schools? Don't you care about children's futures?" },
      { time: 78, speaker: 'McCormick', text: "That is a loaded question and I won't dignify --" },
      { time: 81, speaker: 'Rainwater', text: "The fact that you can't answer tells voters everything they need to know." },
      { time: 86, speaker: 'Moderator', text: "Let's keep this civil. Senator Braun, a follow-up on voucher accountability." },
      { time: 90, speaker: 'Braun', text: "Look, every state that has adopted school choice has seen improvement. Arizona did it, Florida did it, and their results speak for themselves. Indiana just needs to follow the leaders." },
      { time: 105, speaker: 'McCormick', text: "If we start diverting public funds to private schools with no oversight, next it will be religious schools, then homeschool co-ops, and eventually there won't be any public education system left at all." },
      { time: 120, speaker: 'Rainwater', text: "Here's what I know: the government ruins everything it touches. Education should be no different. It's human nature to do better when you have choices." },
      { time: 132, speaker: 'Moderator', text: "Thank you. We'll take a short break before our next topic." },
    ],
    speakerTimeline: [
      { start: 0, end: 9, speaker: 'moderator' },
      { start: 9, end: 34, speaker: 'mccormick' },
      { start: 35, end: 37, speaker: 'moderator' },
      { start: 37, end: 62, speaker: 'braun' },
      { start: 63, end: 66, speaker: 'moderator' },
      { start: 66, end: 77, speaker: 'rainwater' },
      { start: 78, end: 80, speaker: 'mccormick' },
      { start: 81, end: 85, speaker: 'rainwater' },
      { start: 86, end: 90, speaker: 'moderator' },
      { start: 90, end: 104, speaker: 'braun' },
      { start: 105, end: 119, speaker: 'mccormick' },
      { start: 120, end: 131, speaker: 'rainwater' },
      { start: 132, end: 140, speaker: 'moderator' },
    ],
    fallacies: [
      {
        id: 'c2_f1',
        type: 'appeal_to_authority',
        startTime: 9,
        endTime: 24,
        speaker: 'mccormick',
        confidence: 'high',
        quote: "Dr. Patricia Alvarez, the dean of education at IU, has said that fully funding public schools is the single most important thing we can do. If the experts say it, we should listen.",
        explanation:
          "McCormick cites a single academic authority and treats her opinion as conclusive -- 'if the experts say it, we should listen.' While expert testimony can be valuable evidence, an appeal to authority becomes fallacious when it is used as a substitute for substantive argument. The policy should be evaluated on its merits and supporting data, not accepted simply because one expert endorses it.",
        teachingTip:
          "Expert opinions are starting points, not conclusions. Ask: 'Is the speaker using the expert's credentials to bypass the actual argument?' If so, it may be an Appeal to Authority. Real evidence stands on its own, regardless of who presents it.",
      },
      {
        id: 'c2_f2',
        type: 'strawman',
        startTime: 25,
        endTime: 34,
        speaker: 'mccormick',
        confidence: 'medium',
        quote: "Senator Braun's voucher program is just a scheme to defund public schools so his wealthy donors can profit from private academies.",
        explanation:
          "McCormick recharacterizes the voucher program as a deliberate 'scheme' designed to benefit wealthy donors, rather than engaging with its stated purpose of expanding parental choice. By attributing a corrupt motive and describing it in the most negative possible terms, she attacks a distorted version of the policy rather than the actual proposal.",
        teachingTip:
          "Straw Man arguments often add sinister motives that were never stated. If someone says 'what they really want is...' and then attacks that reframed version, they may be constructing a Straw Man.",
      },
      {
        id: 'c2_f3',
        type: 'false_cause',
        startTime: 37,
        endTime: 49,
        speaker: 'braun',
        confidence: 'high',
        quote: "We've been increasing education budgets for twenty years and test scores keep declining. More money clearly doesn't fix bad schools.",
        explanation:
          "Braun observes two trends -- rising budgets and declining test scores -- and concludes that increased funding does not help. But correlation does not establish causation. Many other variables affect test scores: demographic shifts, curriculum changes, testing methodology, pandemic disruptions. The fact that two trends coincide does not prove that one caused (or failed to prevent) the other.",
        teachingTip:
          "When someone says 'we did X and Y still happened, so X doesn't work,' check whether other factors could explain Y. Two things happening at the same time does not mean one caused the other. That is the False Cause fallacy.",
      },
      {
        id: 'c2_f4',
        type: 'anecdotal',
        startTime: 50,
        endTime: 62,
        speaker: 'braun',
        confidence: 'medium',
        quote: "I talked to a mother in Fort Wayne whose daughter went from failing in public school to thriving at a charter school. That's the power of competition.",
        explanation:
          "A single family's positive experience with school choice does not demonstrate that the policy works broadly. Systematic research involves looking at outcomes across thousands of students, controlling for selection effects and other variables. One success story, however genuine, cannot substitute for that kind of evidence.",
        teachingTip:
          "Stories are memorable but they are not data. When a speaker uses one person's experience to prove a policy works for everyone, that is Anecdotal reasoning. Look for: 'I met someone who...' followed by a sweeping conclusion.",
      },
      {
        id: 'c2_f5',
        type: 'loaded_question',
        startTime: 66,
        endTime: 77,
        speaker: 'rainwater',
        confidence: 'high',
        quote: "Why do you support a system that traps children in failing schools? Don't you care about children's futures?",
        explanation:
          "This question contains built-in assumptions -- that the current system 'traps' children and that the schools are uniformly 'failing' -- which the other candidates would have to accept just by answering. The follow-up, 'don't you care about children's futures,' further implies that disagreeing with Rainwater means not caring about children. The question is designed to put opponents in a lose-lose position.",
        teachingTip:
          "Loaded Questions smuggle in assumptions. The classic example is 'have you stopped cheating?' Any direct answer accepts the premise. Watch for questions where saying 'yes' or 'no' both make you look bad -- the question itself may be the fallacy.",
      },
      {
        id: 'c2_f6',
        type: 'slippery_slope',
        startTime: 105,
        endTime: 119,
        speaker: 'mccormick',
        confidence: 'high',
        quote: "If we start diverting public funds to private schools with no oversight, next it will be religious schools, then homeschool co-ops, and eventually there won't be any public education system left at all.",
        explanation:
          "McCormick presents a chain of consequences -- vouchers lead to religious school funding, then homeschool funding, then the total elimination of public education -- without showing that each step necessarily follows. Voucher programs in other states have coexisted with public schools for decades. The argument substitutes a parade of fears for evidence about likely outcomes.",
        teachingTip:
          "Slippery Slope chains are easy to spot once you know the pattern: 'If A, then B, then C... then disaster.' The key test is whether the speaker proves each link in the chain. Without that proof, they are just stacking worries.",
      },
    ],
  },

  // -----------------------------------------------------------------------
  // CLIP 3 -- Indiana Gubernatorial Debate: Public Safety
  // -----------------------------------------------------------------------
  {
    id: 'indiana_gov_2024_03',
    title: 'Indiana Gubernatorial Debate - Public Safety',
    description:
      'Candidates discuss crime, policing reform, and community safety in Indiana cities.',
    youtubeId: 'dQw4w9WgXcQ', // placeholder
    duration: 155, // seconds
    speakers: [
      { id: 'mccormick', name: 'McCormick', party: 'Democrat', color: '#3b82f6' },
      { id: 'braun', name: 'Braun', party: 'Republican', color: '#ef4444' },
      { id: 'rainwater', name: 'Rainwater', party: 'Libertarian', color: '#f59e0b' },
    ],
    transcript: [
      { time: 0, speaker: 'Moderator', text: "Our next topic is public safety. Violent crime in Indianapolis rose twelve percent last year. Senator Braun, what is your plan?" },
      { time: 9, speaker: 'Braun', text: "Thank you. The answer is simple: support our police. Since Democrats started pushing defund-the-police rhetoric, crime has skyrocketed everywhere. Their anti-police agenda is why our cities are less safe." },
      { time: 24, speaker: 'Braun', text: "We need more officers, tougher sentencing, and an end to these soft-on-crime prosecutors who let repeat offenders walk free." },
      { time: 35, speaker: 'Moderator', text: "Ms. McCormick." },
      { time: 37, speaker: 'McCormick', text: "Nobody on this stage has called for defunding the police, and Senator Braun knows that. What I have called for is accountability and community investment alongside policing." },
      { time: 49, speaker: 'McCormick', text: "But I want to address something else. Chief Martinez in Indianapolis, a thirty-year law enforcement veteran, supports our community policing model. When someone with that experience backs the approach, it carries real weight." },
      { time: 63, speaker: 'Moderator', text: "Mr. Rainwater, how do you approach public safety?" },
      { time: 66, speaker: 'Rainwater', text: "The real question is: are we going to keep expanding government power, or are we going to trust citizens? It is one or the other. Either we have a police state or we have an armed, responsible citizenry." },
      { time: 80, speaker: 'Braun', text: "You know, I find it interesting that my opponent lectures us about police accountability when her own party's mayor in Indianapolis has presided over record homicides. Clean up your own house first." },
      { time: 95, speaker: 'McCormick', text: "Senator, crime data actually shows that violent crime increased in rural Republican counties at the same rate as urban areas. This is not a party problem." },
      { time: 108, speaker: 'Braun', text: "Folks, after I became a senator, crime in my home county dropped fifteen percent. My tough-on-crime stance made the community safer. That's what leadership looks like." },
      { time: 122, speaker: 'Rainwater', text: "Both of you keep talking about more government programs. A father in Evansville told me he feels safe because he has the right to protect his family. That is the real answer to public safety." },
      { time: 137, speaker: 'Moderator', text: "We have time for brief closing thoughts on this topic. Senator Braun?" },
      { time: 140, speaker: 'Braun', text: "Look, either you stand with our police officers or you stand with the criminals. It's that simple. I will always back the blue." },
      { time: 150, speaker: 'Moderator', text: "Thank you all. We'll continue after the break." },
    ],
    speakerTimeline: [
      { start: 0, end: 9, speaker: 'moderator' },
      { start: 9, end: 34, speaker: 'braun' },
      { start: 35, end: 37, speaker: 'moderator' },
      { start: 37, end: 62, speaker: 'mccormick' },
      { start: 63, end: 66, speaker: 'moderator' },
      { start: 66, end: 79, speaker: 'rainwater' },
      { start: 80, end: 94, speaker: 'braun' },
      { start: 95, end: 107, speaker: 'mccormick' },
      { start: 108, end: 121, speaker: 'braun' },
      { start: 122, end: 136, speaker: 'rainwater' },
      { start: 137, end: 140, speaker: 'moderator' },
      { start: 140, end: 150, speaker: 'braun' },
      { start: 150, end: 155, speaker: 'moderator' },
    ],
    fallacies: [
      {
        id: 'c3_f1',
        type: 'strawman',
        startTime: 9,
        endTime: 23,
        speaker: 'braun',
        confidence: 'high',
        quote: "Since Democrats started pushing defund-the-police rhetoric, crime has skyrocketed everywhere. Their anti-police agenda is why our cities are less safe.",
        explanation:
          "Braun attributes a 'defund the police' and 'anti-police agenda' to his opponents even though no one on the stage has advocated for that position. By associating McCormick with an extreme stance she has not taken, he creates a version of her position that is easy to attack. McCormick herself corrects this moments later.",
        teachingTip:
          "A Straw Man often assigns a position the opponent never actually took. Listen for whether the speaker is responding to something that was actually said, or to a more extreme version they invented. If the opponent has to say 'I never said that,' a Straw Man was likely used.",
      },
      {
        id: 'c3_f2',
        type: 'appeal_to_authority',
        startTime: 49,
        endTime: 62,
        speaker: 'mccormick',
        confidence: 'medium',
        quote: "Chief Martinez in Indianapolis, a thirty-year law enforcement veteran, supports our community policing model. When someone with that experience backs the approach, it carries real weight.",
        explanation:
          "McCormick uses Chief Martinez's credentials -- thirty years in law enforcement -- as the primary reason to accept the community policing approach. While his experience is relevant, the argument relies on his authority rather than presenting the evidence behind the model. 'It carries real weight' suggests his endorsement should be sufficient to settle the matter.",
        teachingTip:
          "Not every mention of an expert is a fallacy. It crosses the line when the expert's opinion is treated as proof rather than as supporting evidence. Ask: 'Is the speaker also giving reasons, or just citing the expert's title?'",
      },
      {
        id: 'c3_f3',
        type: 'black_or_white',
        startTime: 66,
        endTime: 79,
        speaker: 'rainwater',
        confidence: 'high',
        quote: "Either we have a police state or we have an armed, responsible citizenry.",
        explanation:
          "Rainwater presents exactly two options -- a police state or armed citizens -- when in reality there is a broad spectrum of public safety approaches, including community policing, social services, court reform, and many others. By framing the choice as binary, he eliminates nuanced middle-ground positions from consideration.",
        teachingTip:
          "False Dilemmas use 'either/or' framing where more than two options exist. Phrases like 'it is one or the other' and 'you either X or Y' are strong signals. Reality is rarely binary.",
      },
      {
        id: 'c3_f4',
        type: 'tu_quoque',
        startTime: 80,
        endTime: 94,
        speaker: 'braun',
        confidence: 'high',
        quote: "Her own party's mayor in Indianapolis has presided over record homicides. Clean up your own house first.",
        explanation:
          "Instead of addressing McCormick's call for police accountability on its merits, Braun deflects by pointing to crime under a Democratic mayor. The underlying logic is: 'you cannot criticize my position because your side has the same problem.' Even if true, this does not answer whether accountability reforms are a good idea.",
        teachingTip:
          "Tu Quoque deflects rather than rebuts. The formula is: 'You can't criticize X because you/your side does X too.' The original argument remains unanswered. Watch for 'clean up your own house' or 'look in the mirror' language.",
      },
      {
        id: 'c3_f5',
        type: 'false_cause',
        startTime: 108,
        endTime: 121,
        speaker: 'braun',
        confidence: 'high',
        quote: "After I became a senator, crime in my home county dropped fifteen percent. My tough-on-crime stance made the community safer.",
        explanation:
          "Braun assumes that because crime dropped after he became senator, his stance caused the decrease. But a U.S. senator has very limited direct influence over local crime rates. Many other factors -- local policing changes, economic conditions, demographic trends, even national crime trends -- could explain the decline. The timing is coincidental until proven otherwise.",
        teachingTip:
          "False Cause often appears as 'after X, Y happened, therefore X caused Y.' This is the classic 'post hoc ergo propter hoc' error. Ask: 'Could other factors explain the change? Does this person actually have the power to cause this outcome?'",
      },
      {
        id: 'c3_f6',
        type: 'anecdotal',
        startTime: 122,
        endTime: 136,
        speaker: 'rainwater',
        confidence: 'medium',
        quote: "A father in Evansville told me he feels safe because he has the right to protect his family. That is the real answer to public safety.",
        explanation:
          "Rainwater uses a single father's feeling of safety to argue that armed self-defense is 'the real answer' to public safety. One person feeling safe does not constitute evidence about what makes communities safer overall. Systematic data on gun ownership and community safety is far more complex than any individual's experience suggests.",
        teachingTip:
          "Anecdotal arguments use one person's experience as proof of a general rule. They are especially persuasive because stories are relatable, but they cannot substitute for broader evidence. Ask: 'Is this one example being used to prove something about everyone?'",
      },
      {
        id: 'c3_f7',
        type: 'black_or_white',
        startTime: 140,
        endTime: 150,
        speaker: 'braun',
        confidence: 'high',
        quote: "Either you stand with our police officers or you stand with the criminals. It's that simple.",
        explanation:
          "Braun reduces the entire public safety discussion to two sides -- police or criminals -- with no room for nuance. In reality, one can support police officers while also advocating for reforms, accountability, or alternative approaches to certain situations. The framing implies that any criticism of policing is equivalent to siding with criminals, which shuts down legitimate debate.",
        teachingTip:
          "This is a textbook False Dilemma combined with emotional pressure. 'You're either with us or against us' eliminates the possibility of supporting police AND wanting reform. When someone says 'it's that simple,' it usually is not.",
      },
    ],
  },
];

/**
 * Look up a clip by its unique id.
 * @param {string} id - The clip id (e.g. 'indiana_gov_2024_01')
 * @returns {object|undefined} The clip object, or undefined if not found.
 */
export function getClipById(id) {
  return CLIPS.find((clip) => clip.id === id);
}
