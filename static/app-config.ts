interface IPageDef {
  title: string;
  href: string;
  permittedRoles?: string[];
}

interface IMenuItemDef {
  title: string;
  href: string;
  permittedRoles?: string[];
  subMenu?: IPageDef[];
  group?: string;
  icon?: string;
}

interface IAppDef {
  name: string;
  description: string;
  home: IPageDef;
  menu: IMenuItemDef[];
}

const farmbook: IAppDef = {
  name: 'FarmBook',
  description: 'A comprehensive quality management platform for agrigultural crop farming.',
  home: {
    title: 'Dashboard',
    href: '/dashboard',
  },
  menu: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'GridView',
    },
    {
      title: 'Farmers',
      href: '/farmer/list',
      icon: 'AccountCircleOutlined',
      subMenu: [
        {
          title: 'Add Farmer',
          href: '/farmer/create',
        },
        {
          title: 'Farmer Details',
          href: '/farmer/:id',
        },
        {
          title: 'Edit Farmer Details',
          href: '/farmer/:id/edit',
        },
      ],
    },
    {
      title: 'Land Parcels',
      href: '/landparcel/list',
      group: 'Land Parcels',
      icon: 'LayersOutlined',
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
          title: 'Edit Land Parcel Details',
          href: '/landparcel/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/landparcel/:id/create-event',
        },
        {
          title: 'Land Parcel Event Details',
          href: '/landparcel/:id/event/:eventId',
        },
        {
          title: 'Edit Cropping System',
          href: 'croppingsystem/:id/edit',
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
          href: '/productionsystem/:id/dairy/create-event',
        },
        {
          title: 'Add Cow Production System Event',
          href: '/productionsystem/:id/cow/create-event',
        },
        {
          title: 'Add Sheep Production System Event',
          href: '/productionsystem/:id/sheep/create-event',
        },
        {
          title: 'Add Goat Production System Event',
          href: '/productionsystem/:id/goats/create-event',
        },
        {
          title: 'Add Aquaculture Production System Event',
          href: '/productionsystem/:id/aquaculture/create-event',
        },
      ],
    },
    {
      title: 'Processing Dashboard',
      href: '/procdashboard',
      group: 'Land Parcels',
      icon: 'GridView',
    },
    {
      title: 'Processing Systems',
      href: '/processingsystem/list',
      group: 'Land Parcels',
      icon: 'PermDataSettingOutlined',
      subMenu: [
        {
          title: 'Processing System Details',
          href: '/processingsystem/:id',
        },
        {
          title: 'Add Event',
          href: '/processingsystem/:id/create-event',
        },
        {
          title: 'Processing System Event Details',
          href: '/processingsystem/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Crops',
      href: '/crop/list',
      icon: 'EnergySavingsLeafOutlined',
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
          title: 'Edit Crop Details',
          href: '/crop/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/crop/:id/create-event',
        },
        {
          title: 'Crop Event Details',
          href: '/crop/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Processors',
      href: '/processor/list',
      icon: 'EngineeringOutlined',
      subMenu: [
        {
          title: 'Add Processor',
          href: '/processor/create',
        },
        {
          title: 'Processor Details',
          href: '/processor/:id',
        },
        {
          title: 'Edit Processor Details',
          href: '/processor/:id/edit',
        },
      ],
    },
    {
      title: 'Products',
      href: '/product/list',
      group: 'Products',
      icon: 'ProductIcon',
      subMenu: [
        {
          title: 'Add Product',
          href: '/product/create',
        },
        {
          title: 'Product Details',
          href: '/product/:id',
        },
        {
          title: 'Edit Product Details',
          href: '/product/:id/edit',
        },
      ],
    },
    {
      title: 'Product Batches',
      href: '/productbatch/list',
      group: 'Products',
      icon: 'ProductsBatchesIcon',
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
          title: 'Edit Product Batch Details',
          href: '/productbatch/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/productbatch/:id/create-event',
        },
        {
          title: 'Product Batch Event Details',
          href: '/productbatch/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Notifications',
      href: '/notifications/list',
      group: 'Notifications',
      icon: 'NotificationsNoneOutlined',
      subMenu: [
        {
          title: 'Submission',
          href: '/submission/:id',
        },
      ],
    },
    {
      title: 'Mobile Notifications',
      href: '/mobile-notifications',
      group: 'Notifications',
      icon: 'AdUnitsIcon',
    },
    {
      title: 'Animal Husbandry Dashboard',
      href: '/ahdashboard',
      group: 'Animal Husbandry',
      icon: 'GridView',
    },
    {
      title: 'Poultry Dashboard',
      href: '/poultrydashboard',
      group: 'Animal Husbandry',
      icon: 'GridView',
    },
    {
      title: 'Aquaculture Dashboard',
      href: '/aquadashboard',
      group: 'Animal Husbandry',
      icon: 'GridView',
    },
    {
      title: 'Production Systems',
      href: '/productionsystem/list',
      group: 'Animal Husbandry',
      icon: 'GiteOutlined',
      subMenu: [
        {
          title: 'Production System Details',
          href: '/productionsystem/:id',
        },
        {
          title: 'Add Event',
          href: '/productionsystem/:id/aquaculture/create-event',
        },
        {
          title: 'Add Event',
          href: '/productionsystem/:id/diary/create-event',
        },
        {
          title: 'Add Event',
          href: '/productionsystem/:id/goats/create-event',
        },
        {
          title: 'Add Event',
          href: '/productionsystem/:id/poultry/create-event',
        },
        {
          title: 'Add Event',
          href: '/productionsystem/:id/sheep/create-event',
        },
        {
          title: 'Production System Event Details',
          href: '/productionsystem/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Poultry Batches',
      href: '/poultrybatch/list',
      group: 'Animal Husbandry',
      icon: 'PoultryIcon',
      subMenu: [
        {
          title: 'Add Poultry Batch',
          href: '/poultrybatch/create',
        },
        {
          title: 'Poultry Batch Details',
          href: '/poultrybatch/:id',
        },
        {
          title: 'Edit Poultry Batch Details',
          href: '/poultrybatch/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/poultrybatch/:id/create-event',
        },
        {
          title: 'Poultry Batch Event Details',
          href: '/poultrybatch/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Cows',
      href: '/cow/list',
      group: 'Animal Husbandry',
      icon: 'CowIcon',
      subMenu: [
        {
          title: 'Add Cow',
          href: '/cow/create',
        },
        {
          title: 'Cow Details',
          href: '/cow/:id',
        },
        {
          title: 'Edit Cow Details',
          href: '/cow/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/cow/:id/create-event',
        },
        {
          title: 'Cow Event Details',
          href: '/cow/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Goats',
      href: '/goat/list',
      group: 'Animal Husbandry',
      icon: 'GoatIcon',
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
          title: 'Edit Goat Details',
          href: '/goat/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/goat/:id/create-event',
        },
        {
          title: 'Goat Event Details',
          href: '/goat/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Sheep',
      href: '/sheep/list',
      group: 'Animal Husbandry',
      icon: 'SheepIcon',
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
          title: 'Edit Sheep Details',
          href: '/sheep/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/sheep/:id/create-event',
        },
        {
          title: 'Sheep Event Details',
          href: '/sheep/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Aquaculture Crops',
      href: '/aquacrop/list',
      group: 'Animal Husbandry',
      icon: 'AquaIcon',
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
          title: 'Edit Aquaclture Crop Details',
          href: '/aquacrop/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/aquacrop/:id/create-event',
        },
        {
          title: 'Aquaculture Crop Event Details',
          href: '/aquacrop/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Poultry POPs',
      href: '/poultrypop/list',
      group: 'Animal Husbandry',
      icon: 'ListAltOutlined',
      subMenu: [
        {
          title: 'Add Poultry POP',
          href: '/poultrypop/create',
        },
        {
          title: 'Add Poultry POP',
          href: '/poultrypop/create?duplicate_from_id=:id',
        },
        {
          title: 'Poultry POP Details',
          href: '/poultrypop/:id',
        },
        {
          title: 'Edit Poultry POP Details',
          href: '/poultrypop/:id/edit',
        },
      ],
    },
    {
      title: 'Aquaculture POPs',
      href: '/aquapop/list',
      group: 'Animal Husbandry',
      icon: 'ListAltOutlined',
      subMenu: [
        {
          title: 'Add Aquaculture POP',
          href: '/aquapop/create',
        },
        {
          title: 'Add Aquaculture POP',
          href: '/aquapop/create?duplicate_from_id=:id',
        },
        {
          title: 'Aquaculture POP Details',
          href: '/aquapop/:id',
        },
        {
          title: 'Edit Aquaculture POP Details',
          href: '/aquapop/:id/edit',
        },
      ],
    },
    {
      title: 'Tasks',
      href: '/task/list',
      icon: 'TaskOutlined',
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
      title: 'Users',
      href: '/user/list',
      icon: 'ManageAccountsOutlined',
      group: 'Administration',
      permittedRoles: ['ADMIN'],
      subMenu: [
        {
          title: 'Add User',
          href: '/user/create',
        },
        {
          title: 'User Details',
          href: '/user/:id',
        },
        {
          title: 'Edit User Details',
          href: '/user/:id/edit',
        },
      ],
    },
    {
      title: 'Operators',
      href: '/collective/list',
      icon: 'GroupsOutlined',
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
          title: 'Edit Operator Details',
          href: '/collective/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/collective/:id/create-event',
        },
        {
          title: 'Create Transaction Certificate',
          href: '/collective/:id/transactioncertificate/create',
        },
        {
          title: 'Transaction Certificate Details',
          href: '/collective/:id/transactioncertificate/:tcId',
        },
        {
          title: 'Operator Event Details',
          href: '/collective/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Certification Bodies',
      href: '/certificationbody/list',
      icon: 'WorkspacePremiumOutlined',
      group: 'Administration',
      permittedRoles: ['ADMIN'],
      subMenu: [
        {
          title: 'Add Certification Body',
          href: '/certificationbody/create',
        },
        {
          title: 'Certification Body Details',
          href: '/certificationbody/:id',
        },
        {
          title: 'Edit Certification Body Details',
          href: '/certificationbody/:id/edit',
        },
      ],
    },
    {
      title: 'POPs',
      href: '/pop/list',
      group: 'Administration',
      icon: 'ListAltOutlined',
      subMenu: [
        {
          title: 'Add POP',
          href: '/pop/create',
        },
        {
          title: 'Add POP',
          href: '/pop/create?duplicate_from_id=:id',
        },
        {
          title: 'POP Details',
          href: '/pop/:id',
        },
        {
          title: 'Edit POP Details',
          href: '/pop/:id/edit',
        },
      ],
    },
    {
      title: 'Schemes',
      href: '/scheme/list',
      group: 'Administration',
      icon: 'ListAltOutlined',
      subMenu: [
        {
          title: 'Add Scheme',
          href: '/scheme/create',
        },
        {
          title: 'Scheme Details',
          href: '/scheme/:id',
        },
        {
          title: 'Edit Scheme Details',
          href: '/scheme/:id/edit',
        },
      ],
    },
    {
      title: 'Scheme POPs',
      href: '/schemepop/list',
      group: 'Administration',
      icon: 'ListAltOutlined',
      subMenu: [
        {
          title: 'Add Scheme POP',
          href: '/schemepop/create',
        },
        {
          title: 'Add Scheme POP',
          href: '/schemepop/create?duplicate_from_id=:id',
        },
        {
          title: 'Scheme POP Details',
          href: '/schemepop/:id',
        },
        {
          title: 'Edit Scheme POP Details',
          href: '/schemepop/:id/edit',
        },
      ],
    },
    {
      title: 'Reports',
      href: '/reports/list',
      group: 'Administration',
      icon: 'AssessmentOutlined',
    },
  ],
};

const aquabook: IAppDef = {
  name: 'AquaBook',
  description: 'A comprehensive quality management platform for aquaculture farming.',
  home: {
    title: 'Dashboard',
    href: '/aquadashboard',
  },
  menu: [
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
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
      group: 'Administration',
      permittedRoles: ['ADMIN'],
      subMenu: [
        {
          title: 'Add Aquaculture POP',
          href: '/aquapop/create',
        },
        {
          title: 'Add Aquaculture POP',
          href: '/aquapop/create?duplicate_from_id=:id',
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
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
  ],
};


const poultrybook: IAppDef = {
  name: 'PoultryBook',
  description: 'A comprehensive quality management platform for poultry farming.',
  home: {
    title: 'Dashboard',
    href: '/poultrydashboard',
  },
  menu: [
    {
      title: 'Dashboard',
      href: '/poultrydashboard',
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
      icon: 'LayersOutlined',
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
          title: 'Edit Land Parcel Details',
          href: '/landparcel/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/landparcel/:id/create-event',
        },
        {
          title: 'Land Parcel Event Details',
          href: '/landparcel/:id/event/:eventId',
        },
        {
          title: 'Edit Cropping System',
          href: 'croppingsystem/:id/edit',
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
          href: '/productionsystem/:id/dairy/create-event',
        },
      ],
    },
    {
      title: 'Processing Systems',
      href: '/processingsystem/list',
      icon: 'PermDataSettingOutlined',
      subMenu: [
        {
          title: 'Processing System Details',
          href: '/processingsystem/:id',
        },
        {
          title: 'Add Event',
          href: '/processingsystem/:id/create-event',
        },
        {
          title: 'Processing System Event Details',
          href: '/processingsystem/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Production Systems',
      href: '/productionsystem/list',
      icon: 'GiteOutlined',
      subMenu: [
        {
          title: 'Production System Details',
          href: '/productionsystem/:id',
        },
        {
          title: 'Add Event',
          href: '/productionsystem/:id/poultry/create-event',
        },
        {
          title: 'Production System Event Details',
          href: '/productionsystem/:id/event/:eventId',
        },
      ],
    },
    {
      title: 'Poultry Batches',
      href: '/poultrybatch/list',
      icon: 'PoultryIcon',
      subMenu: [
        {
          title: 'Add Poultry Batch',
          href: '/poultrybatch/create',
        },
        {
          title: 'Poultry Batch Details',
          href: '/poultrybatch/:id',
        },
        {
          title: 'Edit Poultry Batch Details',
          href: '/poultrybatch/:id/edit',
        },
        {
          title: 'Add Event',
          href: '/poultrybatch/:id/create-event',
        },
        {
          title: 'Poultry Batch Event Details',
          href: '/poultrybatch/:id/event/:eventId',
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
      group: 'Administration',
      permittedRoles: ['ADMIN'],
      subMenu: [
        {
          title: 'Add User',
          href: '/user/create',
        },
        {
          title: 'User Details',
          href: '/user/:id',
        },
        {
          title: 'Edit User Details',
          href: '/user/:id/edit',
        },
      ],
    },
    {
      title: 'Operators',
      href: '/collective/list',
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
      href: '/poultrypop/list',
      group: 'Administration',
      permittedRoles: ['ADMIN'],
      subMenu: [
        {
          title: 'Add Poultry POP',
          href: '/poultrypop/create',
        },
        {
          title: 'Add Poultry POP',
          href: '/poultrypop/create?duplicate_from_id=:id',
        },
        {
          title: 'Poultry POP Details',
          href: '/poultrypop/:id',
        },
        {
          title: 'Edit Poultry POP Details',
          href: '/poultrypop/:id/edit',
        },
      ],
    },
    {
      title: 'Reports',
      href: '/reports/list',
      group: 'Administration',
      permittedRoles: ['ADMIN'],
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
  ],
};

export const getMenuItems = () => {
  switch (process.env.NEXT_PUBLIC_APP_NAME) {
    case 'farmbook':
      return farmbook;
    case 'aquabook':
      return aquabook;
    case 'poultrybook':
      return poultrybook;
    default:
      return farmbook;
  }
};
