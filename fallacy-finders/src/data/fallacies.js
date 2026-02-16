/**
 * Fallacy Finders - Complete Fallacy Data
 *
 * 24 logical fallacies organized into 4 tiers of increasing difficulty.
 * Each fallacy includes identification info, descriptions, teaching notes,
 * watch-for cues, and example quotes.
 */

export const TIERS = {
  1: {
    name: 'Beginner',
    color: '#4CAF50',
    requiredAccuracy: 0.8,
    requiredClips: 5,
  },
  2: {
    name: 'Intermediate',
    color: '#FF9800',
    requiredAccuracy: 0.75,
    requiredClips: 6,
  },
  3: {
    name: 'Advanced',
    color: '#F44336',
    requiredAccuracy: 0.7,
    requiredClips: 7,
  },
  4: {
    name: 'Expert',
    color: '#9C27B0',
    requiredAccuracy: 0.65,
    requiredClips: 8,
  },
};

export const FALLACIES = [
  // ── Tier 1: Beginner ──────────────────────────────────────────────────
  {
    id: 'ad_hominem',
    name: 'Ad Hominem',
    tier: 1,
    icon: '\u{1F6E1}\uFE0F', // shield
    shortDesc:
      "You attacked your opponent's character or personal traits in an attempt to undermine their argument.",
    teachingNote:
      "Ad hominem attacks can take the form of overtly attacking somebody, or more subtly casting doubt on their character or personal attributes as a way to discredit their argument. The result of an ad hom attack can be to undermine someone's case without actually having to engage with it.",
    watchFor: 'Character attacks, questioning motives',
    example:
      "Don't listen to her healthcare ideas - she's never held a real job",
  },
  {
    id: 'strawman',
    name: 'Strawman',
    tier: 1,
    icon: '\u{1F33E}', // sheaf of rice / scarecrow
    shortDesc:
      "You misrepresented someone's argument to make it easier to attack.",
    teachingNote:
      "By exaggerating, misrepresenting, or just completely fabricating someone's argument, it's much easier to present your own position as being reasonable, but this kind of dishonesty serves to undermine honest rational debate.",
    watchFor: 'They just want to..., Their only goal is...',
    example:
      'She wants to cut military spending, so she clearly wants us defenseless',
  },
  {
    id: 'black_or_white',
    name: 'Black-or-White / False Dilemma',
    tier: 1,
    icon: '\u{25FB}\uFE0F', // black and white squares
    shortDesc:
      'You presented two alternative states as the only possibilities, when in fact more possibilities exist.',
    teachingNote:
      "Also known as the false dilemma, this insidious tactic has the appearance of forming a logical argument, but under closer scrutiny it becomes evident that there are more possibilities than the either/or choice that is presented. Binary, black-or-white thinking does not allow for the many different variables, conditions, and contexts in which there would exist more than just the two possibilities put forth. It frames the argument misleadingly and obscures rational, honest debate.",
    watchFor: "Either we... or we..., You're either with us or against us",
    example: "You're either for the bill or you hate children",
  },
  {
    id: 'bandwagon',
    name: 'Bandwagon',
    tier: 1,
    icon: '\u{1F6B2}', // bicycle / wagon
    shortDesc:
      'You appealed to popularity or the fact that many people do something as an attempted form of validation.',
    teachingNote:
      "The flaw in this argument is that the popularity of an idea has absolutely no bearing on its validity. If it did, then the Earth would have made itself flat for most of history to accommodate this popular belief.",
    watchFor: 'Everyone knows..., Most people agree...',
    example: 'Everyone supports this policy, so it must be right',
  },
  {
    id: 'appeal_to_authority',
    name: 'Appeal to Authority',
    tier: 1,
    icon: '\u{1F451}', // crown
    shortDesc:
      'You said that because an authority thinks something, it must therefore be true.',
    teachingNote:
      "It's important to note that this fallacy should not be used to dismiss the claims of experts, or scientific consensus. Appeals to authority are not valid arguments, but nor is it reasonable to disregard the claims of experts who have a demonstrated depth of knowledge unless one has a similar level of understanding and/or access to empirical evidence. However, it is entirely possible that the opinion of a person or institution of authority is wrong; therefore the authority that such a person or institution holds does not have any intrinsic bearing upon whether their claims are true or not.",
    watchFor: 'Experts say..., The professor told me...',
    example: 'The CEO said it, so it must be true',
  },
  {
    id: 'tu_quoque',
    name: 'Tu Quoque',
    tier: 1,
    icon: '\u{1F448}', // pointing hand
    shortDesc:
      'You avoided having to engage with criticism by turning it back on the accuser - you answered criticism with criticism.',
    teachingNote:
      "Pronounced too-kwo-kweh. Literally translating as 'you too' this fallacy is also known as the appeal to hypocrisy. It is commonly employed as an effective red herring because it takes the heat off someone having to defend their argument, and instead shifts the focus back on to the person making the criticism.",
    watchFor: 'But you did it too, What about when you...',
    example: 'You criticize my spending? You spent even more last year!',
  },

  // ── Tier 2: Intermediate ──────────────────────────────────────────────
  {
    id: 'false_cause',
    name: 'False Cause',
    tier: 2,
    icon: '\u{1F480}', // skull
    shortDesc:
      'You presumed that a real or perceived relationship between things means that one is the cause of the other.',
    teachingNote:
      'Many people confuse correlation (things happening together or in sequence) for causation (that one thing actually causes the other to happen). Sometimes correlation is coincidental, or it may be attributable to a common cause.',
    watchFor: 'After X happened, Y happened, so X caused Y',
    example:
      'Crime went down after we installed cameras, so cameras prevent crime',
  },
  {
    id: 'slippery_slope',
    name: 'Slippery Slope',
    tier: 2,
    icon: '\u{26F7}\uFE0F', // skier / slope figure
    shortDesc:
      'You said that if we allow A to happen, then Z will eventually happen too, therefore A should not happen.',
    teachingNote:
      "The problem with this reasoning is that it avoids engaging with the issue at hand, and instead shifts attention to extreme hypotheticals. Because no proof is presented to show that such extreme hypotheticals will in fact occur, this fallacy has the form of an appeal to emotion fallacy by leveraging fear. In effect the argument at hand is unfairly tainted by unsubstantiated conjecture.",
    watchFor: 'If we allow this, next thing you know...',
    example:
      "If we allow students to redo one test, soon they'll expect to redo everything",
  },
  {
    id: 'loaded_question',
    name: 'Loaded Question',
    tier: 2,
    icon: '\u{1F3AF}', // crosshair / target
    shortDesc:
      "You asked a question that had a presumption built into it so that it couldn't be answered without appearing guilty.",
    teachingNote:
      'Loaded question fallacies are particularly effective at derailing rational debates because of their inflammatory nature - the recipient of the loaded question is compelled to defend themselves and may appear flustered or on the back foot.',
    watchFor: 'When did you stop..., Why do you always...',
    example: 'When did you stop ignoring your constituents?',
  },
  {
    id: 'anecdotal',
    name: 'Anecdotal',
    tier: 2,
    icon: '\u{1F4AC}', // speech bubble / alpha
    shortDesc:
      'You used a personal experience or an isolated example instead of a sound argument or compelling evidence.',
    teachingNote:
      "It's often much easier for people to believe someone's testimony as opposed to understanding complex data and variation across a continuum. Quantitative scientific measures are almost always more accurate than personal perceptions and experiences, but our inclination is to believe that which is tangible to us, and/or the word of someone we trust over a more 'abstract' statistical reality.",
    watchFor: 'I know someone who..., In my experience...',
    example:
      "My uncle smoked all his life and lived to 90, so smoking isn't harmful",
  },

  // ── Tier 3: Advanced ──────────────────────────────────────────────────
  {
    id: 'appeal_to_nature',
    name: 'Appeal to Nature',
    tier: 3,
    icon: '\u{1F343}', // leaves
    shortDesc:
      "You argued that because something is 'natural' it is therefore valid, justified, inevitable, good or ideal.",
    teachingNote:
      "Many 'natural' things are also considered 'good', and this can bias our thinking; but naturalness itself doesn't make something good or bad. For instance murder could be seen as very natural, but that doesn't mean it's good or justifiable.",
    watchFor: "It's only natural that..., Nature intended...",
    example:
      'Herbal remedies are natural, so they must be better than medicine',
  },
  {
    id: 'genetic',
    name: 'Genetic',
    tier: 3,
    icon: '\u{1F9EC}', // DNA
    shortDesc:
      'You judged something as either good or bad on the basis of where it comes from, or from whom it came.',
    teachingNote:
      "This fallacy avoids the argument by shifting focus onto something's or someone's origins. It's similar to an ad hominem fallacy in that it leverages existing negative perceptions to make someone's argument look bad, without actually presenting a case for why the argument itself lacks merit.",
    watchFor: 'That idea came from..., Consider the source...',
    example:
      "That policy originated in Europe, so it won't work here",
  },
  {
    id: 'burden_of_proof',
    name: 'Burden of Proof',
    tier: 3,
    icon: '\u{1F3CB}\uFE0F', // lifting figure
    shortDesc:
      'You said that the burden of proof lies not with the person making the claim, but with someone else to disprove.',
    teachingNote:
      "The burden of proof lies with someone who is making a claim, and is not upon anyone else to disprove. The inability, or disinclination, to disprove a claim does not render that claim valid, nor give it any credence whatsoever. However it is important to note that we can never be certain of anything, and so we must assign value to any claim based on the available evidence, and to dismiss something on the basis that it hasn't been proven beyond all doubt is also fallacious reasoning.",
    watchFor: "Prove me wrong, You can't disprove it...",
    example:
      "You can't prove this policy won't work, so we should try it",
  },
  {
    id: 'begging_the_question',
    name: 'Begging the Question',
    tier: 3,
    icon: '\u{2753}', // question marks
    shortDesc:
      'You presented a circular argument in which the conclusion was included in the premise.',
    teachingNote:
      "This logically incoherent argument often arises in situations where people have an assumption that is very ingrained, and therefore taken in their minds as a given. Circular reasoning is bad mostly because it's not very good.",
    watchFor: "It's true because it's obviously true",
    example:
      "This policy is the best because it's better than all the others",
  },
  {
    id: 'ambiguity',
    name: 'Ambiguity',
    tier: 3,
    icon: '\u{1FAB9}', // vase / goblet (empty nest as closest)
    shortDesc:
      'You used a double meaning or ambiguity of language to mislead or misrepresent the truth.',
    teachingNote:
      "Politicians are often guilty of using ambiguity to mislead and will later point to how they were technically not outright lying if they come under scrutiny. The reason that it qualifies as a fallacy is that it is intrinsically misleading.",
    watchFor: 'Double meanings, vague terms, technically true statements',
    example:
      "I support the workers (meaning I'll stand near them, not help them)",
  },
  {
    id: 'personal_incredulity',
    name: 'Personal Incredulity',
    tier: 3,
    icon: '\u{1F937}', // person shrugging / person with question
    shortDesc:
      "Because you found something difficult to understand, or are unaware of how it works, you made out like it's probably not true.",
    teachingNote:
      "Complex subjects like biological evolution through natural selection require some amount of understanding before one is able to make an informed judgement about the subject at hand; this fallacy is usually used in place of that understanding.",
    watchFor: "I don't see how..., That doesn't make sense to me...",
    example:
      "I don't understand how the economy works, so this plan can't be right",
  },
  {
    id: 'composition_division',
    name: 'Composition/Division',
    tier: 3,
    icon: '\u{1F534}', // circles
    shortDesc:
      'You assumed that one part of something has to be applied to all, or other, parts of it; or that the whole must apply to its parts.',
    teachingNote:
      'Often when something is true for the part it does also apply to the whole, or vice versa, but the crucial difference is whether there exists good evidence to show that this is the case. Because we observe consistencies in things, our thinking can become biased so that we presume consistency to exist where it does not.',
    watchFor: 'The state is successful, so this person is successful',
    example:
      'This one bridge is broken, so the whole infrastructure is a failure',
  },
  {
    id: 'appeal_to_emotion',
    name: 'Appeal to Emotion',
    tier: 3,
    icon: '\u{2764}\uFE0F', // heart
    shortDesc:
      'You attempted to manipulate an emotional response in place of a valid or compelling argument.',
    teachingNote:
      "Appeals to emotion include appeals to fear, envy, hatred, pity, pride, and more. It's important to note that sometimes a logically coherent argument may inspire emotion or have an emotional aspect, but the problem and fallacy occurs when emotion is used instead of a logical argument, or to obscure the fact that no compelling rational reason exists for one's position. Everyone, bar sociopaths, is affected by emotion, and so appeals to emotion are a very common and effective argument tactic, but they're ultimately flawed, dishonest, and tend to make one's opponents justifiably emotional.",
    watchFor: 'Think of the children!, How would you feel if...',
    example:
      "If you don't support this bill, you don't care about families",
  },

  // ── Tier 4: Expert ────────────────────────────────────────────────────
  {
    id: 'middle_ground',
    name: 'Middle Ground',
    tier: 4,
    icon: '\u{2696}\uFE0F', // balance scale / parallel lines
    shortDesc:
      'You claimed that a compromise, or middle point, between two extremes must be the truth.',
    teachingNote:
      "Humans are funny creatures and have a foolish aversion to being wrong. Rather than appreciate the benefits of being able to change one's mind through better understanding, many will invent ways to cling to old beliefs. One of the most common ways that people do this is to post-rationalize a reason why what they thought to be true must remain to be true.",
    watchFor: 'The truth is somewhere in the middle...',
    example: 'One says 2+2=4, the other says 2+2=6, so it must be 5',
  },
  {
    id: 'texas_sharpshooter',
    name: 'Texas Sharpshooter',
    tier: 4,
    icon: '\u{1F3AF}', // target
    shortDesc:
      'You cherry-picked a data cluster to suit your argument, or found a pattern to fit a presumption.',
    teachingNote:
      "This 'false cause' fallacy is coined after a marksman shooting randomly at barns and then painting bullseye targets around the spot where the most bullet holes appear, making it appear as if he's a really good shot. Clusters naturally appear by chance, but don't necessarily indicate that there is a causal relationship.",
    watchFor: 'Look at this specific data point..., In this one case...',
    example:
      'In these 3 months crime dropped, proving the policy works',
  },
  {
    id: 'no_true_scotsman',
    name: 'No True Scotsman',
    tier: 4,
    icon: '\u{1F432}', // dragon / Loch Ness monster
    shortDesc:
      "You made what could be called an appeal to purity as a way to dismiss relevant criticisms or flaws of your argument.",
    teachingNote:
      "In this form of faulty reasoning one's belief is rendered unfalsifiable because no matter how compelling the evidence is, one simply shifts the goalposts so that it wouldn't apply to a supposedly 'true' example. This kind of post-rationalization is a way of avoiding valid criticisms of one's argument.",
    watchFor: 'No real American would..., A true patriot...',
    example: 'No true leader would make that decision',
  },
  {
    id: 'special_pleading',
    name: 'Special Pleading',
    tier: 4,
    icon: '\u{1F64F}', // person kneeling / praying hands
    shortDesc:
      'You moved the goalposts or made up an exception when your claim was shown to be false.',
    teachingNote:
      "Humans are funny creatures and have a foolish aversion to being wrong. Rather than appreciate the benefits of being able to change one's mind through better understanding, many will invent ways to cling to old beliefs. One of the most common ways that people do this is to post-rationalize a reason why what they thought to be true must remain to be true.",
    watchFor: 'But this case is different because...',
    example: 'That rule applies to everyone except this situation',
  },
  {
    id: 'nirvana_fallacy',
    name: 'Nirvana Fallacy',
    tier: 4,
    icon: '\u{2728}', // sparkles / perfection
    shortDesc:
      "You rejected a solution because it wasn't perfect, rather than evaluating if it was better than the status quo.",
    teachingNote:
      'Perfect is the enemy of good. By holding solutions to an impossible standard of perfection, one can dismiss any practical improvement. This fallacy ignores that incremental progress has value.',
    watchFor: "But it won't solve everything..., It's not perfect...",
    example:
      "This healthcare plan won't cover everyone, so we shouldn't do it",
  },
  {
    id: 'fallacy_fallacy',
    name: 'The Fallacy Fallacy',
    tier: 4,
    icon: '\u{1F3A9}', // top hat / bowtie
    shortDesc:
      'You presumed that because a claim has been poorly argued, or a fallacy has been made, that the claim itself must be wrong.',
    teachingNote:
      'It is entirely possible to make a claim that is false yet argue with logical coherency for that claim, just as it is possible to make a claim that is true and justify it with various fallacies and poor arguments.',
    watchFor: 'They used a fallacy, so they must be wrong',
    example:
      'Your argument had a fallacy, so your conclusion is false',
  },
];

/**
 * Get all fallacies belonging to a specific tier.
 * @param {number} tier - The tier number (1-4)
 * @returns {Array} Fallacies in that tier
 */
export function getFallaciesByTier(tier) {
  return FALLACIES.filter((f) => f.tier === tier);
}

/**
 * Get a single fallacy by its ID.
 * @param {string} id - The fallacy id (e.g. 'ad_hominem')
 * @returns {Object|undefined} The fallacy object, or undefined if not found
 */
export function getFallacyById(id) {
  return FALLACIES.find((f) => f.id === id);
}
