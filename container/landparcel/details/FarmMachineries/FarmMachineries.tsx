import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import VerticalTabs from '~/components/lib/Navigation/VerticalTabs';
import FarmTractorDetails from '~/container/landparcel/details/FarmMachineries/FarmTractorDetails';
import FarmMachineryDetails from '~/container/landparcel/details/FarmMachineries/FarmMachineryDetails';
import FarmToolsDetails from '~/container/landparcel/details/FarmMachineries/FarmToolsDetails';
import FarmEquipmentsDetails from '~/container/landparcel/details/FarmMachineries/FarmEquipmentsDetails';
export default function FarmMachineries(props: any) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const FarmTractorsEditor = dynamic(
    import('~/gen/data-views/farmTractors/farmTractorsEditor.rtml'),
  );
  const FarmMachineriesEditor = dynamic(
    import('~/gen/data-views/farmMachineries/farmMachineriesEditor.rtml'),
  );
  const FarmToolsEditor = dynamic(import('~/gen/data-views/farmTools/farmToolsEditor.rtml'));
  const FarmEquipmentsEditor = dynamic(
    import('~/gen/data-views/farmEquipments/farmEquipmentsEditor.rtml'),
  );
  const componentData = [
    {
      label: 'Tractors',
      count: props?.lpData?.farmTractors?.length || 0,
      component: (
        <FarmTractorDetails
          data={props?.lpData}
          lpMap={props?.lpData?.map}
          reFetch={props.reFetch}
          Editor={FarmTractorsEditor}
          modelName={props.modelName}
        />
      ),
    },
    {
      label: 'Machinery',
      count: props?.lpData?.farmMachineries?.length || 0,
      component: (
        <FarmMachineryDetails
          data={props?.lpData}
          lpMap={props?.lpData?.map}
          reFetch={props.reFetch}
          Editor={FarmMachineriesEditor}
          modelName={props.modelName}
        />
      ),
    },
    {
      label: 'Tools',
      count: props?.lpData?.farmTools?.length || 0,
      component: (
        <FarmToolsDetails
          data={props?.lpData}
          lpMap={props?.lpData?.map}
          reFetch={props.reFetch}
          Editor={FarmToolsEditor}
          modelName={props.modelName}
        />
      ),
    },
    {
      label: 'Equipments/Implements',
      count:
        props?.lpData?.farmEquipments?.tillageImplements?.length +
        props?.lpData?.farmEquipments?.sowingEquipments?.length +
        props?.lpData?.farmEquipments?.plantProtections?.length +
        props?.lpData?.farmEquipments?.weedingAndInterculturalImplements?.length +
        props?.lpData?.farmEquipments?.harvestingAndThreshing?.length || 0,
      component: (
        <FarmEquipmentsDetails
          data={props?.lpData}
          handleFormSubmit={props.handleFormSubmit}
          title='Equipments/Implements'
          Editor={FarmEquipmentsEditor}
        />
      ),
    },
  ];
  const labels = componentData?.map((item, index) => ({ label: item.label, count: item.count }));
  const panels = componentData?.map((item, index) => item.component);
  return (
    <>
      <VerticalTabs labels={labels} panels={panels} isCountPresent />
    </>
  );
}
