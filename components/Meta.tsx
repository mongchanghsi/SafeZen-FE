import Head from 'next/head';
import MetaDetails from '../utils/constants/metadata';

enum MetaTagKeys {
  TITLE = 'title',
  META_TITLE = 'meta_title',
  DESCRIPTION = 'description',
  OG_TYPE = 'og:type',
  OG_TITLE = 'og:title',
  OG_URL = 'og:url',
  OG_DESC = 'og:description',
  OG_IMG = 'og:image',
  OG_LOCALE = 'og:locale',
  OG_SITENAME = 'og:site_name',
  TWITTER_CARD = 'twitter:card',
  TWITTER_URL = 'twitter:url',
  TWITTER_TITLE = 'twitter:title',
  TWITTER_DESC = 'twitter:description',
  TWITTER_CREATOR = 'twitter:creator',
}

const Meta = ({
  title,
  keywords,
  description,
  children,
}: {
  title?: string;
  keywords?: string;
  description?: string;
  children?: any;
}) => {
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta
        name='description'
        content={description || MetaDetails.DESCRIPTION}
      />
      <meta itemProp='image' content={MetaDetails.OG_IMG} />
      <meta property={MetaTagKeys.OG_LOCALE} content={MetaDetails.OG_LOCALE} />
      <meta property={MetaTagKeys.OG_TYPE} content={MetaDetails.OG_TYPE} />
      <meta property={MetaTagKeys.OG_TITLE} content={MetaDetails.OG_TITLE} />
      <meta
        property={MetaTagKeys.OG_DESC}
        content={description || MetaDetails.DESCRIPTION}
      />
      <meta property={MetaTagKeys.OG_URL} content={MetaDetails.OG_URL} />
      <meta
        property={MetaTagKeys.OG_SITENAME}
        content={MetaDetails.OG_SITENAME}
      />
      <meta property={MetaTagKeys.OG_IMG} content={MetaDetails.OG_IMG} />
      <meta charSet='utf-8' />
      <link rel='icon' href='/favicon.ico' />
      <title>{title || MetaDetails.TITLE}</title>
      {children}
    </Head>
  );
};

export default Meta;
