import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import BreadCrumbNav from '../components/common/BreadCrumbNav';
import { useRouter } from 'next/router';

export default function BreadCrumbMenu({ menuItems, styles }: any) {
  const router = useRouter();
  const updateOrgInLink = (link: string) => {
    return link.replace(':org', router.query.org as string);
  };
  return (
    <Breadcrumbs
      separator='›'
      aria-label='breadcrumb'
      sx={{
        ...styles.breadCumb,
      }}
    >
      <BreadCrumbNav
        title={'Home'}
        href={
          process.env.NEXT_PUBLIC_APP_NAME !== 'evlocker'
            ? `/dashboard`
            : `/private/evlocker/reports`
        }
        key={0}
        activeLink={styles.linkColor}
      />
      {menuItems?.map((item: any, index: number) => (
        <BreadCrumbNav
          title={item.title}
          href={updateOrgInLink(item.href)}
          key={index}
          activeLink={item.selected ? styles.stylesactiveLinkColor : styles.linkColor}
        />
      ))}
    </Breadcrumbs>
  );
}
