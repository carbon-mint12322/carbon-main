import { getMenuItems } from './app-config';

const getMatchingByHref = (href) => () => {
  return getMenuItems().menu?.map((item, i) => {
    let selectedIndex = false;
    if (item?.subMenu && item?.subMenu?.length) {
      const subMenu = item?.subMenu?.map((sub) => {
        if (sub.href === href) selectedIndex = true;
        return {
          ...sub,
          selected: sub.href === href,
        };
      });
      return {
        ...item,
        subMenu,
        selected: selectedIndex ? selectedIndex : item.href === href,
      };
    }
      return {
        ...item,
        selected: item.href === href,
      };
  });
};

const getMenuFromContext = (context) => {
  let currentUrl = context.resolvedUrl;
  const query = context.query;
  if (query?.org) {
    currentUrl = currentUrl.replace(query?.org, ':org');
  }

  if (query?.id) {
    currentUrl = currentUrl.replace(query?.id, ':id');
  }

  if (query?.eventId) {
    currentUrl = currentUrl.replace(query?.eventId, ':eventId');
  }

  if (query?.tcId) {
    currentUrl = currentUrl.replace(query?.tcId, ':tcId');
  }

  if (query?.duplicate_from_id) {
    currentUrl = currentUrl.replace(query?.duplicate_from_id, ':id');
  }


  const regex = /^\/private\/farmbook\/:org(.*)$/i;
  const matches = currentUrl.match(regex);
  if (matches) {
    currentUrl = matches?.[1] ? matches?.[1] : currentUrl;
  }
  const menu = getMatchingByHref(currentUrl)();

  // See if anything is selected
  const selected = menu.find((item) => item.selected);
  if (selected) {
    return menu;
  }

};

const getPageTitleFromContext = (context) => {
  const href = context.resolvedUrl;
  const menuItem = getMenuItems().menu?.find((mi) => mi.href === href);
  return (menuItem && menuItem.title) || undefined;
};

export const getPageConfig = (context) => ({
  props: {
    pageConfig: {
      ...getMenuItems(),
      title: getPageTitleFromContext(context) || getMenuItems().name,
      menuItems: getMenuFromContext(context),
    },
  },
});

