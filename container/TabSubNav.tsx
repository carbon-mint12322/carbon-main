import React from 'react';
import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import DetailsCard from '~/components/common/DetailsCard';

export default function TabSubNav({ data }: any) {
  return (
    <>
      <VerticalTabs
        labels={data?.map((item: any, index: any) => {
          return { label: item.label };
        })}
        panels={data?.map((item: any, index: any) => {
          if (item?.component) {
            return item?.component;
          } else {
            return (
              <DetailsCard
                showEditButton={item.showEditButton}
                title={item.title}
                key={index}
                items={item?.data}
                handleMainBtnClick={item.onClick}
              />
            );
          }
        })}
      />
    </>
  );
}
