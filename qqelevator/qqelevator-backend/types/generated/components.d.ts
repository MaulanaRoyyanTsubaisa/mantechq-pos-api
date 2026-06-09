import type { Schema, Struct } from '@strapi/strapi';

export interface ContactPageBusinessHour extends Struct.ComponentSchema {
  collectionName: 'components_contact_page_business_hours';
  info: {
    displayName: 'BusinessHour';
    icon: 'clock';
  };
  attributes: {
    days: Schema.Attribute.String;
    hours: Schema.Attribute.String;
  };
}

export interface ContactPageFormSubjects extends Struct.ComponentSchema {
  collectionName: 'components_contact_page_form_subjects';
  info: {
    displayName: 'form_subjects';
    icon: 'strikeThrough';
  };
  attributes: {
    subject: Schema.Attribute.String;
  };
}

export interface ContactPageSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_contact_page_social_links';
  info: {
    displayName: 'SocialLink';
    icon: 'code';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['Facebook', 'Twitter', 'Instagram', 'LinkedIn']
    >;
    url: Schema.Attribute.String;
  };
}

export interface ElementsCardFetaure extends Struct.ComponentSchema {
  collectionName: 'components_elements_card_fetaures';
  info: {
    displayName: 'Card Fetaure';
  };
  attributes: {
    description: Schema.Attribute.Text;
    Icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsTombolHero extends Struct.ComponentSchema {
  collectionName: 'components_elements_tombol_heroes';
  info: {
    displayName: 'Tombol Hero';
    icon: 'bold';
  };
  attributes: {
    link: Schema.Attribute.String;
    style: Schema.Attribute.Enumeration<['primary', 'secondary']>;
    teks: Schema.Attribute.String;
  };
}

export interface HomePageClientLogo extends Struct.ComponentSchema {
  collectionName: 'components_home_page_client_logos';
  info: {
    displayName: 'Client Logo';
    icon: 'picture';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface HomePageSeksiWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_home_page_seksi_why_choose_uses';
  info: {
    displayName: 'Seksi Why Choose Us';
  };
  attributes: {
    benefitCards: Schema.Attribute.Component<'elements.card-fetaure', true>;
    subtitle: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface HomePageTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_home_page_testimonials';
  info: {
    displayName: 'Testimonial';
  };
  attributes: {
    authorName: Schema.Attribute.String;
    authorPosition: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    quote: Schema.Attribute.Text;
  };
}

export interface MilestoneMilestone extends Struct.ComponentSchema {
  collectionName: 'components_milestone_milestones';
  info: {
    displayName: 'Milestone';
    icon: 'file';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    year: Schema.Attribute.String;
  };
}

export interface MilestoneSectionContent extends Struct.ComponentSchema {
  collectionName: 'components_milestone_section_contents';
  info: {
    displayName: 'SectionContent';
    icon: 'eye';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface NavLinksLanguage extends Struct.ComponentSchema {
  collectionName: 'components_nav_links_languages';
  info: {
    displayName: 'language';
  };
  attributes: {
    code: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    label: Schema.Attribute.String;
  };
}

export interface NavLinksNavDropdown extends Struct.ComponentSchema {
  collectionName: 'components_nav_links_nav_dropdowns';
  info: {
    displayName: 'Nav Dropdown';
  };
  attributes: {
    dropdownItems: Schema.Attribute.Component<'nav-links.nav-link', true>;
    label: Schema.Attribute.String;
  };
}

export interface NavLinksNavLink extends Struct.ComponentSchema {
  collectionName: 'components_nav_links_nav_links';
  info: {
    displayName: 'NavLink';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ProductsCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_products_cta_sections';
  info: {
    displayName: 'cta_section';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.tombol-hero', true>;
    Subtitle: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface ProductsFiturProduk extends Struct.ComponentSchema {
  collectionName: 'components_products_fitur_produks';
  info: {
    displayName: 'Fitur Produk';
  };
  attributes: {
    feature: Schema.Attribute.String;
  };
}

export interface ProductsHeroProdukDetail extends Struct.ComponentSchema {
  collectionName: 'components_products_hero_produk_details';
  info: {
    displayName: 'Hero Produk Detail';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'elements.tombol-hero', true>;
    subtitle: Schema.Attribute.String;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ProductsItemFitur extends Struct.ComponentSchema {
  collectionName: 'components_products_item_fiturs';
  info: {
    displayName: 'Item Fitur';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface ProductsItemSpek extends Struct.ComponentSchema {
  collectionName: 'components_products_item_speks';
  info: {
    displayName: 'Item Spek';
  };
  attributes: {
    judulspek: Schema.Attribute.String;
    nilaispek: Schema.Attribute.String;
  };
}

export interface ProductsSeksiAplikasi extends Struct.ComponentSchema {
  collectionName: 'components_products_seksi_aplikasis';
  info: {
    displayName: 'Seksi Aplikasi';
  };
  attributes: {
    daftarTags: Schema.Attribute.Component<'products.tag-aplikasi', true>;
    title: Schema.Attribute.String;
  };
}

export interface ProductsSeksiFiturUtama extends Struct.ComponentSchema {
  collectionName: 'components_products_seksi_fitur_utamas';
  info: {
    displayName: 'Seksi Fitur Utama';
    icon: 'code';
  };
  attributes: {
    daftarFitur: Schema.Attribute.Component<'products.item-fitur', true>;
    title: Schema.Attribute.String;
  };
}

export interface ProductsSeksiSpekTeknis extends Struct.ComponentSchema {
  collectionName: 'components_products_seksi_spek_teknis';
  info: {
    displayName: 'Seksi Spek Teknis';
  };
  attributes: {
    daftarSpek: Schema.Attribute.Component<'products.item-spek', true>;
    title: Schema.Attribute.String;
  };
}

export interface ProductsTagAplikasi extends Struct.ComponentSchema {
  collectionName: 'components_products_tag_aplikasis';
  info: {
    displayName: 'Tag Aplikasi';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface ProjectClientLogo extends Struct.ComponentSchema {
  collectionName: 'components_project_client_logos';
  info: {
    displayName: 'ClientLogo';
  };
  attributes: {
    client_logos: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface ProjectFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_project_feature_items';
  info: {
    displayName: 'feature-item';
    icon: 'apps';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SocialLinkSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_social_link_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'code';
  };
  attributes: {
    platform: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TeamMemberTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_team_member_team_members';
  info: {
    displayName: 'TeamMember';
    icon: 'user';
  };
  attributes: {
    linkedin_url: Schema.Attribute.String;
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    position: Schema.Attribute.String;
    twitter_url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'contact-page.business-hour': ContactPageBusinessHour;
      'contact-page.form-subjects': ContactPageFormSubjects;
      'contact-page.social-link': ContactPageSocialLink;
      'elements.card-fetaure': ElementsCardFetaure;
      'elements.tombol-hero': ElementsTombolHero;
      'home-page.client-logo': HomePageClientLogo;
      'home-page.seksi-why-choose-us': HomePageSeksiWhyChooseUs;
      'home-page.testimonial': HomePageTestimonial;
      'milestone.milestone': MilestoneMilestone;
      'milestone.section-content': MilestoneSectionContent;
      'nav-links.language': NavLinksLanguage;
      'nav-links.nav-dropdown': NavLinksNavDropdown;
      'nav-links.nav-link': NavLinksNavLink;
      'products.cta-section': ProductsCtaSection;
      'products.fitur-produk': ProductsFiturProduk;
      'products.hero-produk-detail': ProductsHeroProdukDetail;
      'products.item-fitur': ProductsItemFitur;
      'products.item-spek': ProductsItemSpek;
      'products.seksi-aplikasi': ProductsSeksiAplikasi;
      'products.seksi-fitur-utama': ProductsSeksiFiturUtama;
      'products.seksi-spek-teknis': ProductsSeksiSpekTeknis;
      'products.tag-aplikasi': ProductsTagAplikasi;
      'project.client-logo': ProjectClientLogo;
      'project.feature-item': ProjectFeatureItem;
      'social-link.social-link': SocialLinkSocialLink;
      'team-member.team-member': TeamMemberTeamMember;
    }
  }
}
