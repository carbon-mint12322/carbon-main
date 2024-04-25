var dashMenuItems, data, menuItems, operatorMenuItems;

const farmbookMenu = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Farmers',
    href: '/farmer/list',
    subMenu: [
      {
        title: 'Add Farmer',
        href: '/farmer/create',
      },
      {
        title: 'Farmer Details',
        href: '/farmer/:id',
      },
    ],
  },
  {
    title: 'Land Parcels',
    href: '/landparcel/list',
    subMenu: [
      {
        title: 'Add Land Parcel',
        href: '/landparcel/create',
      },
      {
        title: 'Land Parcel Details',
        href: '/landparcel/:id',
      },
      {
        title: 'Add Event',
        href: '/landparcel/:id/create-event',
      },
      {
        title: 'Edit Processing System',
        href: '/processingsystem/:id/edit',
      },
      {
        title: 'Edit Prodcution System',
        href: '/productionsystem/:id/edit',
      },
      {
        title: 'Add Cropping System Event',
        href: '/croppingsystem/:id/create-event',
      },
      {
        title: 'Add Poultry Production System Event',
        href: '/productionsystem/:id/poultryproductionsystem/create-event',
      },
      {
        title: 'Add Cow Production System Event',
        href: '/productionsystem/:id/cowproductionsystem/create-event',
      },
      {
        title: 'Add Sheep Production System Event',
        href: '/productionsystem/:id/sheepproductionsystem/create-event',
      },
      {
        title: 'Add Goat Production System Event',
        href: '/productionsystem/:id/goatproductionsystem/create-event',
      },
      {
        title: 'Add Aquaculture Production System Event',
        href: '/productionsystem/:id/aquacultureproductionsystem/create-event',
      },
    ],
  },
  {
    title: 'Crops',
    href: '/crop/list',
    subMenu: [
      {
        title: 'Add Crop',
        href: '/crop/create',
      },
      {
        title: 'Crop Details',
        href: '/crop/:id',
      },
      {
        title: 'Add Event',
        href: '/crop/:id/create-event',
      },
    ],
  },
  {
    title: 'Notifications',
    href: '/notifications/list',
    subMenu: [
      {
        title: 'Submission',
        href: '/submission/:id',
      },
    ],
  },
  {
    title: 'Users',
    href: '/user/list',
    subMenu: [
      {
        title: 'Add User',
        href: '/user/create',
      },
      {
        title: 'User Details',
        href: '/user/:id',
      },
    ],
  },
  {
    title: 'Operators',
    href: '/collective/list',
    subMenu: [
      {
        title: 'Add Operator',
        href: '/collective/create',
      },
      {
        title: 'Operator Details',
        href: '/collective/:id',
      },
      {
        title: 'Add Event',
        href: '/collective/:id/create-event',
      },
      {
        title: 'Transaction Certificate Details',
        href: '/collective/collectivetransactioncert/:id',
      },
    ],
  },
  {
    title: 'Certification Bodies',
    href: '/certificationbody/list',
    subMenu: [
      {
        title: 'Add Certification Body',
        href: '/certificationbody/create',
      },
      {
        title: 'Certification Body Details',
        href: '/certificationbody/:id',
      },
    ],
  },
  {
    title: 'POPs',
    href: '/pop/list',
    subMenu: [
      {
        title: 'Add POP',
        href: '/pop/create',
      },
      {
        title: 'POP Details',
        href: '/pop/:id',
      },
    ],
  },
  {
    title: 'Reports',
    href: '/reports/list',
  },
  {
    title: 'Tasks',
    href: '/task/list',
    subMenu: [
      {
        title: 'Add Task',
        href: '/task/create',
      },
      {
        title: 'Task Details',
        href: '/task/:id',
      },
    ],
  },
  {
    title: 'Processors',
    href: '/processor/list',
    subMenu: [
      {
        title: 'Add Processor',
        href: '/processor/create',
      },
      {
        title: 'Processor Details',
        href: '/processor/:id',
      },
    ],
  },
  {
    title: 'Products',
    href: '/product/list',
    subMenu: [
      {
        title: 'Add Product',
        href: '/product/create',
      },
      {
        title: 'Product Details',
        href: '/product/:id',
      },
    ],
  },
  {
    title: 'Product Batches',
    href: '/productbatch/list',
    subMenu: [
      {
        title: 'Add Product Batch',
        href: '/productbatch/create',
      },
      {
        title: 'Product Batch Details',
        href: '/productbatch/:id',
      },
      {
        title: 'Add Event',
        href: '/productbatch/:id/create-event',
      },
    ],
  },
  {
    title: 'Mobile Notifications',
    href: '/mobile-notifications',
  },
  {
    title: 'Animal Husbandry Dashboard',
    href: '/ahdashboard',
  },
  {
    title: 'Poultry Dashboard',
    href: '/poultrydashboard',
  },
  {
    title: 'Aquaculture Dashboard',
    href: '/aquadashboard',
  },
  {
    title: 'Production Systems',
    href: '/productionsystem/list',
    subMenu: [
      {
        title: 'Production System Event Details',
        href: '/productionsystem/:id/event',
      },
      {
        title: 'Production System Details',
        href: '/productionsystem/:id',
      },
    ],
  },
  {
    title: 'Poultry Batches',
    href: '/poultry/list',
    subMenu: [
      {
        title: 'Add Poultry Batch',
        href: '/poultry/create',
      },
      {
        title: 'Poultry Batch Details',
        href: '/poultry/:id',
      },
      {
        title: 'Add Event',
        href: '/poultry/:id/create-event',
      },
    ],
  },
  {
    title: 'Cows',
    href: '/cow/list',
    subMenu: [
      {
        title: 'Add Cow',
        href: '/cow/create',
      },
      {
        title: 'Cows Details',
        href: '/cow/:id',
      },
      {
        title: 'Add Event',
        href: '/cow/:id/create-event',
      },
    ],
  },
  {
    title: 'Goats',
    href: '/goat/list',
    subMenu: [
      {
        title: 'Add Goat',
        href: '/goat/create',
      },
      {
        title: 'Goat Details',
        href: '/goat/:id',
      },
      {
        title: 'Add Event',
        href: '/goat/:id/create-event',
      },
    ],
  },
  {
    title: 'Sheep',
    href: '/sheep/list',
    subMenu: [
      {
        title: 'Add Sheep',
        href: '/sheep/create',
      },
      {
        title: 'Sheep Details',
        href: '/sheep/:id',
      },
      {
        title: 'Add Event',
        href: '/sheep/:id/create-event',
      },
    ],
  },
  {
    title: 'Aquaculture Crops',
    href: '/aquacrop/list',
    subMenu: [
      {
        title: 'Add Aquaculture Crop',
        href: '/aquacrop/create',
      },
      {
        title: 'Aquaculture Crop Details',
        href: '/aquacrop/:id',
      },
      {
        title: 'Add Event',
        href: '/aquacrop/:id/create-event',
      },
    ],
  },
  {
    title: 'Poultry POPs',
    href: '/poultrypop/list',
    subMenu: [
      {
        title: 'Add Poultry POP',
        href: '/poultrypop/create',
      },
      {
        title: 'Poultry POP Details',
        href: '/poultrypop/:id',
      },
    ],
  },
  {
    title: 'Aquaculture POPs',
    href: '/aquapop/list',
    subMenu: [
      {
        title: 'Add Aquaculture POP',
        href: '/aquapop/create',
      },
      {
        title: 'Aquaculture POP Details',
        href: '/aquapop/:id',
      },
    ],
  },
];

const aquabookMenu = [
  {
    title: 'Dashboard',
    href: '/aquadashboard',
  },
  {
    title: 'Farmers',
    href: '/farmer/list',
    subMenu: [
      {
        title: 'Add Farmer',
        href: '/farmer/create',
      },
      {
        title: 'Farmer Details',
        href: '/farmer/:id',
      },
    ],
  },
  {
    title: 'Land Parcels',
    href: '/landparcel/list',
    subMenu: [
      {
        title: 'Add Land Parcel',
        href: '/landparcel/create',
      },
      {
        title: 'Land Parcel Details',
        href: '/landparcel/:id',
      },
      {
        title: 'Add Event',
        href: '/landparcel/:id/create-event',
      },
      {
        title: 'Edit Processing System',
        href: '/processingsystem/:id/edit',
      },
      {
        title: 'Edit Prodcution System',
        href: '/productionsystem/:id/edit',
      },
      {
        title: 'Add Aquaculture Production System Event',
        href: '/productionsystem/:id/aquacultureproductionsystem/create-event',
      },
    ],
  },
  {
    title: 'Aquaculture Crops',
    href: '/aquacrop/list',
    subMenu: [
      {
        title: 'Add Aquaculture Crop',
        href: '/aquacrop/create',
      },
      {
        title: 'Aquaclture Crop Details',
        href: '/aquacrop/:id',
      },
      {
        title: 'Add Event',
        href: '/aquacrop/:id/create-event',
      },
    ],
  },
  {
    title: 'Production Systems',
    href: '/productionsystem/list',
    subMenu: [
      {
        title: 'Production System Event Details',
        href: '/productionsystem/:id/event',
      },
      {
        title: 'Production System Details',
        href: '/productionsystem/:id',
      },
    ],
  },
  {
    title: 'Notifications',
    href: '/notifications/list',
    subMenu: [
      {
        title: 'Submission',
        href: '/submission/:id',
      },
    ],
  },
  {
    title: 'Users',
    href: '/user/list',
    subMenu: [
      {
        title: 'Add User',
        href: '/user/create',
      },
      {
        title: 'User Details',
        href: '/user/:id',
      },
    ],
  },
  {
    title: 'Operators',
    href: '/collective/list',
    subMenu: [
      {
        title: 'Add Operator',
        href: '/collective/create',
      },
      {
        title: 'Operator Details',
        href: '/collective/:id',
      },
      {
        title: 'Add Event',
        href: '/collective/:id/create-event',
      },
    ],
  },
  {
    title: 'Certification Bodies',
    href: '/certificationbody/list',
    subMenu: [
      {
        title: 'Add Certification Body',
        href: '/certificationbody/create',
      },
      {
        title: 'Certification Body Details',
        href: '/certificationbody/:id',
      },
    ],
  },
  {
    title: 'POPs',
    href: '/aquapop/list',
    subMenu: [
      {
        title: 'Add Aquaculture POP',
        href: '/aquapop/create',
      },
      {
        title: 'Aquaculture POP Details',
        href: '/aquapop/:id',
      },
    ],
  },
  {
    title: 'Reports',
    href: '/reports/list',
  },
  {
    title: 'Tasks',
    href: '/task/list',
    subMenu: [
      {
        title: 'Add Task',
        href: '/task/create',
      },
      {
        title: 'Task Details',
        href: '/task/:id',
      },
    ],
  },
  {
    title: 'Products',
    href: '/product/list',
    subMenu: [
      {
        title: 'Add Product',
        href: '/product/create',
      },
      {
        title: 'Product Details',
        href: '/product/:id',
      },
    ],
  },
  {
    title: 'Product Batches',
    href: '/productbatch/list',
    subMenu: [
      {
        title: 'Add Product Batch',
        href: '/productbatch/create',
      },
      {
        title: 'Product Batch Details',
        href: '/productbatch/:id',
      },
      {
        title: 'Add Event',
        href: '/productbatch/:id/create-event',
      },
    ],
  },
  {
    title: 'Mobile Notifications',
    href: '/mobile-notifications',
  },
];

const adminMenu = [
  {
    title: 'Users',
    href: '/user/list',
    subMenu: [
      {
        title: 'Add User',
        href: '/user/create',
      },
      {
        title: 'User Details',
        href: '/user/:id',
      },
    ],
  },
  {
    title: 'Operators',
    href: '/collective/list',
    subMenu: [
      {
        title: 'Add Operator',
        href: '/collective/create',
      },
      {
        title: 'Operator Details',
        href: '/collective/:id',
      },
      {
        title: 'Add Event',
        href: '/collective/:id/create-event',
      },
    ],
  },
  {
    title: 'Certification Bodies',
    href: '/certificationbody/list',
    subMenu: [
      {
        title: 'Add Certification Body',
        href: '/certificationbody/create',
      },
      {
        title: 'Certification Body Details',
        href: '/certificationbody/:id',
      },
    ],
  },
];

const getMenuItems = () => {
  switch (process.env.NEXT_PUBLIC_APP_NAME) {
    case 'farmbook':
      return farmbookMenu;
    case 'aquabook':
      return aquabookMenu;
    // case 'poultrybook':
    //   return farmFitMenu;
    // case 'animalhusbandrybook':
    //   return farmFitMenu;
    default:
      return farmbookMenu;
  }
};

const getTitle = () => {
  switch (process.env.NEXT_PUBLIC_APP_NAME) {
    case 'farmbook':
      return 'FarmBook';
    case 'evlocker':
      return 'EV Locker';
    case 'aquabook':
      return 'AquaBook';
    default:
      return 'FarmBook';
  }
};

// Data
data = {
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  title: getTitle(),
  menuItems: getMenuItems(),
};

module.exports = module.exports = {
  ...data,

  // Change app-specific home page here
  homePage:
    process.env.NEXT_PUBLIC_APP_NAME !== 'evlocker'
      ? '/private/farmbook/dashboard'
      : '/private/evlocker/reports/list',
};
