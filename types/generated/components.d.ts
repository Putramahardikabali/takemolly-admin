import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsAboutExpertCard extends Struct.ComponentSchema {
  collectionName: 'components_about_elements_about_expert_cards';
  info: {
    displayName: 'about-expert-card';
    icon: 'user';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    profile_image: Schema.Attribute.Media<'images'>;
  };
}

export interface ElementsAthleteSlide extends Struct.ComponentSchema {
  collectionName: 'components_elements_athlete_slides';
  info: {
    displayName: 'Athlete Slide';
  };
  attributes: {
    athlete_tag: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"I'm a MMA Fighter">;
    headline: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'AND I TAKE MOLLY'>;
    poster_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    video_file: Schema.Attribute.Media<'videos'>;
    video_url: Schema.Attribute.String;
  };
}

export interface ElementsBusinessBenefitItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_business_benefit_items';
  info: {
    displayName: 'Benefit Item';
    icon: 'star';
  };
  attributes: {
    accent_color: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsBusinessFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_business_faq_items';
  info: {
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsBusinessProductCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_business_product_cards';
  info: {
    displayName: 'Product Card';
    icon: 'shopping-bag';
  };
  attributes: {
    formula_link: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/formula'>;
    partner_profit: Schema.Attribute.String & Schema.Attribute.Required;
    product_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    product_name: Schema.Attribute.String & Schema.Attribute.Required;
    sell_price: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsBusinessStep extends Struct.ComponentSchema {
  collectionName: 'components_elements_business_steps';
  info: {
    displayName: 'Step';
    icon: 'numbered-list';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    step_number: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsBusinessTestimonialSlide
  extends Struct.ComponentSchema {
  collectionName: 'components_elements_business_testimonial_slides';
  info: {
    displayName: 'Testimonial Slide';
    icon: 'quote';
  };
  attributes: {
    author_avatar: Schema.Attribute.Media<'images'>;
    author_name: Schema.Attribute.String & Schema.Attribute.Required;
    author_role: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Gym Owner'>;
    company_logo: Schema.Attribute.Media<'images'>;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ElementsFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_feature_cards';
  info: {
    description: "Used in the 'Why We Are Better' section to showcase unique selling points";
    displayName: 'Feature Card';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsHowWeDidItVideoItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_how_we_did_it_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.DefaultTo<''>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<''>;
    video_file: Schema.Attribute.Media<'videos'>;
    video_url: Schema.Attribute.String;
  };
}

export interface ElementsIngredientItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_ingredient_items';
  info: {
    displayName: 'ingredient-item';
    icon: 'cube';
  };
  attributes: {
    description: Schema.Attribute.Text;
    dosage: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    slug: Schema.Attribute.String;
  };
}

export interface ElementsOfflineStore extends Struct.ComponentSchema {
  collectionName: 'components_elements_offline_stores';
  info: {
    displayName: 'offline-store';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    latitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
    longitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsOnlineStore extends Struct.ComponentSchema {
  collectionName: 'components_elements_online_stores';
  info: {
    displayName: 'online-store';
    icon: 'shoppingCart';
  };
  attributes: {
    action_url: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    is_recommended: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsSocialProofItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_social_proof_items';
  info: {
    displayName: 'social-proof-item';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    is_large: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface ElementsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_stat_items';
  info: {
    displayName: 'Stat Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String;
    number: Schema.Attribute.String;
  };
}

export interface ElementsStepItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_step_items';
  info: {
    description: "Individual steps for the 'How it Works' section";
    displayName: 'Step Item';
    icon: 'orderedList';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    modal_content: Schema.Attribute.RichText;
    modal_title: Schema.Attribute.String;
    supplements: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplement.supplement'
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsTimelineCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_timeline_cards';
  info: {
    description: "Event cards for the founder's journey slider";
    displayName: 'Timeline Card';
    icon: 'calendar';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAboutContactHelp extends Struct.ComponentSchema {
  collectionName: 'components_about_sections_about_contact_helps';
  info: {
    displayName: 'about-contact-help';
    icon: 'phone';
  };
  attributes: {
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsAboutGovernmentApproved
  extends Struct.ComponentSchema {
  collectionName: 'components_about_sections_about_gov_approved';
  info: {
    displayName: 'about-government-approved';
    icon: 'check';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    video: Schema.Attribute.Media<'videos'>;
    video_button_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Watch Our Lab Tour Video'>;
  };
}

export interface SectionsAboutHero extends Struct.ComponentSchema {
  collectionName: 'components_about_sections_about_heroes';
  info: {
    displayName: 'about-hero';
    icon: 'picture';
  };
  attributes: {
    button_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'View Data'>;
    description: Schema.Attribute.Text;
    founder_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface SectionsAboutLedBy extends Struct.ComponentSchema {
  collectionName: 'components_about_sections_about_led_bys';
  info: {
    displayName: 'about-led-by';
    icon: 'shield';
  };
  attributes: {
    experts: Schema.Attribute.Component<'elements.about-expert-card', true>;
    method_button_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Method'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsAboutPassionProfit extends Struct.ComponentSchema {
  collectionName: 'components_about_sections_about_passion_profits';
  info: {
    displayName: 'about-passion-profit';
    icon: 'heart';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsAthletes extends Struct.ComponentSchema {
  collectionName: 'components_sections_athletes';
  info: {
    description: 'Slider showing athletes and their recovery stories';
    displayName: 'Athletes Video Slider';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'What They\u2019re Saying'>;
    slides: Schema.Attribute.Component<'elements.athlete-slide', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Real {People}. Real {Impact}'>;
  };
}

export interface SectionsBiomarkers extends Struct.ComponentSchema {
  collectionName: 'components_sections_biomarkers';
  info: {
    displayName: 'Biomarkers Section';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'By targeting the most significant building blocks in recovery, our unique formula accelerates your body\u2019s post-exercise healing response.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Critical Biomarkers We\u2019ve Improved'>;
  };
}

export interface SectionsBusinessBenefits extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_benefits';
  info: {
    displayName: 'Benefits Grid';
    icon: 'check-circle';
  };
  attributes: {
    benefit_items: Schema.Attribute.Component<
      'elements.business-benefit-item',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface SectionsBusinessFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_faqs';
  info: {
    displayName: 'FAQ Section';
    icon: 'question-circle';
  };
  attributes: {
    contact_title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Still have questions? Reach us via'>;
    email_text: Schema.Attribute.Text & Schema.Attribute.DefaultTo<'Email'>;
    items: Schema.Attribute.Component<'elements.business-faq-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Frequently Asked Questions'>;
    whatsapp_text: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'WhatsApp'>;
  };
}

export interface SectionsBusinessFounder extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_founders';
  info: {
    displayName: 'Founder Section';
    icon: 'user';
  };
  attributes: {
    button_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Watch The Video'>;
    description: Schema.Attribute.Text;
    founder_image: Schema.Attribute.Media;
    title: Schema.Attribute.String;
    video_url: Schema.Attribute.String;
  };
}

export interface SectionsBusinessHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_heroes';
  info: {
    displayName: 'Hero';
    icon: 'award';
  };
  attributes: {
    badge_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'You Sell, We Supply, No Stock Cost'>;
    cta_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Learn More'>;
    product_image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Have You Got Fitness Customers?'>;
  };
}

export interface SectionsBusinessHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_how_it_works';
  info: {
    displayName: 'How It Works';
    icon: 'list-ol';
  };
  attributes: {
    chat_text: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Chat with us'>;
    signup_text: Schema.Attribute.Text & Schema.Attribute.DefaultTo<'Sign up'>;
    steps: Schema.Attribute.Component<'elements.business-step', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsBusinessMediaMarquee extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_media_marquees';
  info: {
    displayName: 'Media Marquee';
    icon: 'images';
  };
  attributes: {
    logos: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'As Seen in'>;
  };
}

export interface SectionsBusinessProductPricing extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_product_pricings';
  info: {
    displayName: 'Product Pricing';
    icon: 'shopping-cart';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Multi-Box or Single Pack'>;
    products: Schema.Attribute.Component<
      'elements.business-product-card',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface SectionsBusinessTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_sections_business_testimonials';
  info: {
    displayName: 'Testimonials';
    icon: 'comment';
  };
  attributes: {
    slides: Schema.Attribute.Component<
      'elements.business-testimonial-slide',
      true
    >;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms';
  info: {
    displayName: 'contact-form';
    icon: 'envelope';
  };
  attributes: {
    business_hours_days: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'MONDAY - FRIDAY'>;
    business_hours_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Business Hours'>;
    business_hours_time: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'10AM - 5PM WITA (GMT+8)'>;
    email_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Email Address'>;
    email_placeholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'e.g jonmail@email.com'>;
    first_name_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'First Name'>;
    first_name_placeholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'e.g Jon'>;
    heading: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Contact Us'>;
    message_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Message'>;
    message_placeholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Type your message here...'>;
    submit_button_text: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Submit'>;
    subtext: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Someone from our team will be in touch within the hour during business times, and as soon as possible outside business hours.'>;
    thank_you_heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'We appreciate your interest!'>;
    thank_you_subtext: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"we've received your message and will get back to you shortly.">;
  };
}

export interface SectionsFormula extends Struct.ComponentSchema {
  collectionName: 'components_sections_formulas';
  info: {
    displayName: 'Formula Section';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'To build the most comprehensive recovery stack, we meticulously reviewed hundreds of supplements using AI and big data.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'The Game Changers in Recovery'>;
  };
}

export interface SectionsFounderTimeline extends Struct.ComponentSchema {
  collectionName: 'components_sections_founder_timelines';
  info: {
    displayName: 'Founder Timeline';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Trust in someone who\u2019s walked the tough path of recovery, not once, but twice.'>;
    events: Schema.Attribute.Component<'elements.timeline-card', true>;
    main_title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Meet Kai, Our Founder'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'A Double Cancer Survivor'>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: '';
    displayName: 'Hero';
  };
  attributes: {
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Backed by 1,500+ human studies, our formula is scientifically proven to optimize recovery.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Exercise Recovery, We Solved It!'>;
  };
}

export interface SectionsHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_sections_how_it_works';
  info: {
    displayName: 'How It Works';
  };
  attributes: {
    sachet_image: Schema.Attribute.Media & Schema.Attribute.Required;
    steps: Schema.Attribute.Component<'elements.step-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
          min: 3;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'How It Works!'>;
  };
}

export interface SectionsHowWeDidIt extends Struct.ComponentSchema {
  collectionName: 'components_sections_how_we_did_its';
  info: {
    displayName: 'How We Did It';
  };
  attributes: {
    stats: Schema.Attribute.Component<'elements.stat-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'How We Did It'>;
  };
}

export interface SectionsHowWeDidItVideo extends Struct.ComponentSchema {
  collectionName: 'components_sections_how_we_did_it_videos';
  info: {
    displayName: 'Videos';
  };
  attributes: {
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'{Building Trust} Through Transparency: How We {Built Our Grading System}'>;
    videos: Schema.Attribute.Component<
      'elements.how-we-did-it-video-item',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
          min: 3;
        },
        number
      >;
  };
}

export interface SectionsIngredientsList extends Struct.ComponentSchema {
  collectionName: 'components_sections_ingredients_lists';
  info: {
    displayName: 'ingredients-list';
    icon: 'cube';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.ingredient-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPageHeader extends Struct.ComponentSchema {
  collectionName: 'components_sections_page_headers';
  info: {
    displayName: 'page-header';
    icon: 'heading';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsResultTransparency extends Struct.ComponentSchema {
  collectionName: 'components_sections_result_transparencies';
  info: {
    displayName: 'Result Transparency';
    icon: 'shield';
  };
  attributes: {
    button_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Our Method'>;
    button_url: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/how-we-did-it'>;
    content_description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Our supplement ratings are based on evidence drawn from 1,500 placebo-controlled human studies published in peer-reviewed journals. Within that research, about 200 supplements showed measurable benefits, risks, or both.'>;
    content_title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Our 1,500-Study Database'>;
    media_file: Schema.Attribute.Media<'images' | 'videos' | 'files'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'How We {Built Our Grading System}'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'{Building Trust} Through Transparency:'>;
  };
}

export interface SectionsResultsDatabase extends Struct.ComponentSchema {
  collectionName: 'components_sections_results_databases';
  info: {
    displayName: 'Results Database';
  };
  attributes: {
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Using advanced data analytics and AI, we\u2019ve identified the most effective combination of ingredients to improve exercise recovery.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'What Works, Proven by Data'>;
  };
}

export interface SectionsSocialProofGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_social_proof_galleries';
  info: {
    displayName: 'social-proof-gallery';
    icon: 'picture';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.social-proof-item', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsStockistLocator extends Struct.ComponentSchema {
  collectionName: 'components_sections_stockist_locators';
  info: {
    displayName: 'stockist-locator';
    icon: 'pinMap';
  };
  attributes: {
    offline_stores: Schema.Attribute.Component<'elements.offline-store', true>;
    online_stores: Schema.Attribute.Component<'elements.online-store', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsWhyBetter extends Struct.ComponentSchema {
  collectionName: 'components_sections_why_betters';
  info: {
    displayName: 'Why Better Section';
  };
  attributes: {
    features: Schema.Attribute.Component<'elements.feature-card', true>;
    footer_text: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"BPOM-approved and made in a GMP facility, every batch goes through third-party testing to guarantee what's on the label is exactly what's inside">;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"You're most likely missing one of three things, that's where we come in">;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"There's a reason your supplements aren't working">;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.String & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.about-expert-card': ElementsAboutExpertCard;
      'elements.athlete-slide': ElementsAthleteSlide;
      'elements.business-benefit-item': ElementsBusinessBenefitItem;
      'elements.business-faq-item': ElementsBusinessFaqItem;
      'elements.business-product-card': ElementsBusinessProductCard;
      'elements.business-step': ElementsBusinessStep;
      'elements.business-testimonial-slide': ElementsBusinessTestimonialSlide;
      'elements.feature-card': ElementsFeatureCard;
      'elements.how-we-did-it-video-item': ElementsHowWeDidItVideoItem;
      'elements.ingredient-item': ElementsIngredientItem;
      'elements.offline-store': ElementsOfflineStore;
      'elements.online-store': ElementsOnlineStore;
      'elements.social-proof-item': ElementsSocialProofItem;
      'elements.stat-item': ElementsStatItem;
      'elements.step-item': ElementsStepItem;
      'elements.timeline-card': ElementsTimelineCard;
      'sections.about-contact-help': SectionsAboutContactHelp;
      'sections.about-government-approved': SectionsAboutGovernmentApproved;
      'sections.about-hero': SectionsAboutHero;
      'sections.about-led-by': SectionsAboutLedBy;
      'sections.about-passion-profit': SectionsAboutPassionProfit;
      'sections.athletes': SectionsAthletes;
      'sections.biomarkers': SectionsBiomarkers;
      'sections.business-benefits': SectionsBusinessBenefits;
      'sections.business-faq': SectionsBusinessFaq;
      'sections.business-founder': SectionsBusinessFounder;
      'sections.business-hero': SectionsBusinessHero;
      'sections.business-how-it-works': SectionsBusinessHowItWorks;
      'sections.business-media-marquee': SectionsBusinessMediaMarquee;
      'sections.business-product-pricing': SectionsBusinessProductPricing;
      'sections.business-testimonials': SectionsBusinessTestimonials;
      'sections.contact-form': SectionsContactForm;
      'sections.formula': SectionsFormula;
      'sections.founder-timeline': SectionsFounderTimeline;
      'sections.hero': SectionsHero;
      'sections.how-it-works': SectionsHowItWorks;
      'sections.how-we-did-it': SectionsHowWeDidIt;
      'sections.how-we-did-it-video': SectionsHowWeDidItVideo;
      'sections.ingredients-list': SectionsIngredientsList;
      'sections.page-header': SectionsPageHeader;
      'sections.result-transparency': SectionsResultTransparency;
      'sections.results-database': SectionsResultsDatabase;
      'sections.social-proof-gallery': SectionsSocialProofGallery;
      'sections.stockist-locator': SectionsStockistLocator;
      'sections.why-better': SectionsWhyBetter;
      'shared.seo': SharedSeo;
    }
  }
}
