import { SvgIcon } from '@mui/material';
import React from 'react';
interface IProps {
  color?: string;
  height?: number | string;
  width?: number | string;
}
export function Circles({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 19 19'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9.5 8.01562C11.1396 8.01562 12.4688 6.68647 12.4688 5.04688C12.4688 3.40728 11.1396 2.07812 9.5 2.07812C7.8604 2.07812 6.53125 3.40728 6.53125 5.04688C6.53125 6.68647 7.8604 8.01562 9.5 8.01562Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.9531 15.7344C15.5927 15.7344 16.9219 14.4052 16.9219 12.7656C16.9219 11.126 15.5927 9.79688 13.9531 9.79688C12.3135 9.79688 10.9844 11.126 10.9844 12.7656C10.9844 14.4052 12.3135 15.7344 13.9531 15.7344Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5.04688 15.7344C6.68647 15.7344 8.01562 14.4052 8.01562 12.7656C8.01562 11.126 6.68647 9.79688 5.04688 9.79688C3.40728 9.79688 2.07812 11.126 2.07812 12.7656C2.07812 14.4052 3.40728 15.7344 5.04688 15.7344Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
export function TestTube({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M18.5703 6.74216L13.8828 2.05466C13.7643 1.9373 13.6042 1.87146 13.4374 1.87146C13.2707 1.87146 13.1106 1.9373 12.9921 2.05466L4.87495 10.1797L2.83588 12.2109C2.17906 12.8677 1.81006 13.7586 1.81006 14.6875C1.81006 15.6164 2.17906 16.5072 2.83588 17.164C3.49271 17.8209 4.38356 18.1899 5.31245 18.1899C6.24134 18.1899 7.13218 17.8209 7.78901 17.164L13.8749 11.0703L16.5859 8.35935L18.3203 7.78123C18.4217 7.74639 18.5127 7.68665 18.5851 7.60748C18.6574 7.52831 18.7087 7.43225 18.7343 7.3281C18.757 7.22447 18.7539 7.11685 18.7253 7.01469C18.6967 6.91254 18.6434 6.81896 18.5703 6.74216ZM16.0546 7.21873C15.9622 7.25105 15.8772 7.30152 15.8046 7.36716L13.0234 10.1484C12.8593 10.2734 11.6249 11.0547 9.6562 10.0625C8.79682 9.63279 8.0312 9.46873 7.37495 9.44529L13.4374 3.38279L16.9687 6.91404L16.0546 7.21873Z'
        fill={color}
      />
    </svg>
  );
}
export function Gmail({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='24' cy='24' r='23.5' stroke='#ECECEC' />
      <path
        d='M30.8041 16.6797L24.2007 21.8331L17.4463 16.6797V16.6811L17.4544 16.6881V23.9042L24.1245 29.1691L30.8041 24.1076V16.6797Z'
        fill='#EA4335'
      />
      <path
        d='M32.5409 15.4262L30.8068 16.6797V24.1075L36.2636 19.918V17.3942C36.2636 17.3942 35.6012 13.7896 32.5409 15.4262Z'
        fill='#FBBC05'
      />
      <path
        d='M30.8068 24.1077V33.7418H34.9892C34.9892 33.7418 36.1793 33.6192 36.265 32.2626V19.9181L30.8068 24.1077Z'
        fill='#34A853'
      />
      <path d='M17.4548 33.7499V23.9041L17.4463 23.8972L17.4548 33.7499Z' fill='#C5221F' />
      <path
        d='M17.4487 16.6812L15.724 15.4346C12.6637 13.7981 12 17.4013 12 17.4013V19.9251L17.4487 23.8973V16.6812Z'
        fill='#C5221F'
      />
      <path d='M17.4463 16.6811V23.8972L17.4548 23.9042V16.688L17.4463 16.6811Z' fill='#C5221F' />
      <path
        d='M12 19.9264V32.2708C12.0843 33.6288 13.2758 33.75 13.2758 33.75H17.4582L17.4487 23.8973L12 19.9264Z'
        fill='#4285F4'
      />
    </svg>
  );
}
export function WhatsApp({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='24' cy='24' r='24' fill='url(#paint0_linear_401_2340)' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M24 37C31.732 37 38 30.732 38 23C38 15.268 31.732 9 24 9C16.268 9 10 15.268 10 23C10 25.5109 10.661 27.8674 11.8185 29.905L10 37L17.3149 35.3038C19.3014 36.3854 21.5789 37 24 37ZM24 34.8462C30.5425 34.8462 35.8462 29.5425 35.8462 23C35.8462 16.4576 30.5425 11.1538 24 11.1538C17.4576 11.1538 12.1538 16.4576 12.1538 23C12.1538 25.5261 12.9445 27.8675 14.2918 29.7902L13.2308 33.7692L17.2799 32.7569C19.1894 34.0746 21.5046 34.8462 24 34.8462Z'
        fill='#BFC8D0'
      />
      <path
        d='M36 23C36 29.6274 30.6274 35 24 35C21.4722 35 19.1269 34.2184 17.1927 32.8837L13.0909 33.9091L14.1658 29.8784C12.8009 27.9307 12 25.5589 12 23C12 16.3726 17.3726 11 24 11C30.6274 11 36 16.3726 36 23Z'
        fill='url(#paint1_linear_401_2340)'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M24 37C31.732 37 38 30.732 38 23C38 15.268 31.732 9 24 9C16.268 9 10 15.268 10 23C10 25.5109 10.661 27.8674 11.8185 29.905L10 37L17.3149 35.3038C19.3014 36.3854 21.5789 37 24 37ZM24 34.8462C30.5425 34.8462 35.8462 29.5425 35.8462 23C35.8462 16.4576 30.5425 11.1538 24 11.1538C17.4576 11.1538 12.1538 16.4576 12.1538 23C12.1538 25.5261 12.9445 27.8675 14.2918 29.7902L13.2308 33.7692L17.2799 32.7569C19.1894 34.0746 21.5046 34.8462 24 34.8462Z'
        fill='white'
      />
      <path
        d='M20.5 16.5C20.1672 15.8314 19.6565 15.8906 19.1407 15.8906C18.2188 15.8906 16.7812 16.9949 16.7812 19.0501C16.7813 20.7344 17.5234 22.5782 20.0244 25.3362C22.438 27.998 25.6094 29.3749 28.2422 29.3281C30.875 29.2812 31.4167 27.0156 31.4167 26.2504C31.4167 25.9113 31.2062 25.7421 31.0613 25.6961C30.1641 25.2656 28.5093 24.4633 28.1328 24.3125C27.7563 24.1618 27.5597 24.3657 27.4375 24.4766C27.0961 24.802 26.4193 25.7609 26.1875 25.9766C25.9558 26.1923 25.6103 26.0831 25.4665 26.0016C24.9374 25.7893 23.5029 25.1512 22.3595 24.0427C20.9453 22.6719 20.8623 22.2003 20.5959 21.7804C20.3828 21.4446 20.5392 21.2385 20.6172 21.1484C20.9219 20.7969 21.3426 20.2541 21.5313 19.9844C21.7199 19.7147 21.5702 19.3051 21.4803 19.0501C21.0938 17.9531 20.7663 17.0349 20.5 16.5Z'
        fill='white'
      />
      <defs>
        <linearGradient
          id='paint0_linear_401_2340'
          x1='45'
          y1='6'
          x2='-1.16229e-06'
          y2='48'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#5BD066' />
          <stop offset='1' stopColor='#27B43E' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_401_2340'
          x1='34.5'
          y1='14'
          x2='12'
          y2='35'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#5BD066' />
          <stop offset='1' stopColor='#27B43E' />
        </linearGradient>
      </defs>
    </svg>
  );
}
export function Telegram({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='24' cy='24' r='24' fill='url(#paint0_linear_401_2349)' />
      <path
        d='M33.6961 16.6405C33.8653 15.5474 32.8259 14.6845 31.8539 15.1113L12.4951 23.6109C11.7981 23.9169 11.8491 24.9726 12.572 25.2029L16.5643 26.4742C17.3262 26.7168 18.1513 26.5914 18.8166 26.1317L27.8175 19.9132C28.0889 19.7257 28.3847 20.1116 28.1528 20.3507L21.6739 27.0306C21.0454 27.6786 21.1701 28.7766 21.9261 29.2506L29.18 33.7995C29.9936 34.3097 31.0403 33.7972 31.1925 32.8141L33.6961 16.6405Z'
        fill='white'
      />
      <defs>
        <linearGradient
          id='paint0_linear_401_2349'
          x1='24'
          y1='0'
          x2='24'
          y2='48'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#37BBFE' />
          <stop offset='1' stopColor='#007DBB' />
        </linearGradient>
      </defs>
    </svg>
  );
}
export function CarbonMintLogo({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      version='1.2'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 265 129'
      width={width}
      height={height}
    >
      <title>CARBON MINT SVG logo 2-svg</title>
      <g id='Layer'>
        <g id='Layer'>
          <g id='Layer'>
            <g id='Layer'>
              <path
                id='Layer'
                style={{ fill: '#4daf4f' }}
                d='m169.9 0.9c0 0 0 26.8 0 37.1 0 20.5-16.6 37.1-37.1 37.1-11.1 0-37.1 0-37.1 0l19.1-19.1c4.5 4.6 10.9 7.4 17.9 7.4 14 0 25.4-11.4 25.4-25.4 0-7-2.8-13.3-7.4-17.9z'
              />
              <path
                id='Layer'
                style={{ fill: '#398f43' }}
                d='m114.7 56l-19.1 19.1c0 0 0-27.6 0-37.1 0-20.5 16.6-37.1 37.1-37.1 10.2 0 37.1 0 37.1 0l-19.1 19.1c-4.5-4.6-10.9-7.4-17.9-7.4-14 0-25.4 11.4-25.4 25.4 0 7 2.8 13.4 7.3 18z'
              />
              <path
                id='Layer'
                style={{ fill: '#398f43' }}
                d='m139.8 42.1l8.5 4.9c-3.2 5.5-9 9.1-15.7 9.1-5 0-9.5-2-12.8-5.3-3.3-3.3-5.3-7.8-5.3-12.8 0-10 8.1-18.1 18.1-18.1 5 0 9.5 2 12.8 5.3 1.1 1.1 2.1 2.3 2.9 3.7l-8.5 4.9c-0.3-0.6-0.8-1.2-1.3-1.7-1.5-1.5-3.5-2.4-5.8-2.4-4.6 0-8.3 3.7-8.3 8.3 0 2.3 0.9 4.4 2.4 5.9 1.5 1.5 3.6 2.4 5.9 2.4 3.1 0 5.8-1.7 7.1-4.2z'
              />
            </g>
            <g id='Layer'>
              <g id='Mint_1_'>
                <path
                  id='Layer'
                  style={{ fill: '#febf10' }}
                  d='m182.2 104.5c-1.3-1.5-3.2-2.3-5.8-2.3-2.7 0-4.7 0.8-5.9 2.3-1.2 1.5-1.8 3.3-1.8 5.5v18.4h-3.7v-17.7c0-3.8 1-6.6 3-8.5 2-1.9 4.8-2.8 8.4-2.8 4.5 0 7.7 1.5 9.6 4.4 1.7-2.9 4.8-4.4 9.5-4.4 3.5 0 6.3 0.9 8.3 2.8 2 1.9 3 4.7 3 8.5v17.7h-2.3c-0.8 0-1.3-0.5-1.3-1.4v-16.9c0-2.2-0.6-4-1.9-5.6-1.3-1.5-3.2-2.3-5.9-2.3-2.7 0-4.6 0.8-5.9 2.3-1.3 1.5-1.9 3.3-1.9 5.5v18.4h-3.5v-18.3c0-2.2-0.6-4-1.9-5.6z'
                />
                <path
                  id='Layer'
                  style={{ fill: '#febf10' }}
                  d='m216.7 95.3h-3.6v-3.5h2.3c0.8 0 1.3 0.4 1.3 1.3zm-3.6 33.1v-28.5h2.3c0.8 0 1.3 0.5 1.3 1.4v27.1z'
                />
                <path
                  id='Layer'
                  style={{ fill: '#febf10' }}
                  d='m244.3 110.2c0-5.3-2.8-8-8.5-8-5.7 0-8.6 2.7-8.6 8v18.2h-3.6v-17.7c0-3.6 1-6.4 2.9-8.4 1.9-1.9 5-2.9 9.3-2.9 8.1 0 12.1 3.7 12.1 11.2v17.7h-2.2c-0.9 0-1.4-0.5-1.4-1.4z'
                />
                <path
                  id='Layer'
                  style={{ fill: '#febf10' }}
                  d='m257.2 91.8c0.8 0 1.3 0.4 1.3 1.3v6.8h5.9c0 1.9-0.9 2.8-2.7 2.8h-3.2v22c0 0.7 0.4 1.1 1.2 1.1h4.8v2.4c-1.1 0.1-2.1 0.2-3 0.2h-2.9c-1 0-1.8-0.2-2.5-0.7-0.7-0.5-1.1-1.3-1.1-2.4v-33.4h2.2z'
                />
              </g>
              <g id='Carbon_1_'>
                <path
                  id='Layer'
                  style={{ fill: '#3d3f3f' }}
                  d='m14.8 129c-8.6 0-13-5-13.2-14.7 0-9.7 4.4-14.6 13.1-14.8 6.9 0 11 3.1 12.2 9.3h-7.8c-0.9-1.9-2.4-3-4.6-3-3.8 0-5.6 2.9-5.6 8.5 0 5.6 2 8.5 6 8.4 1.7 0 3.1-0.7 4.3-2 0.7-0.7 1.5-1 2.4-1h5.4c-1.4 5.8-5.6 9.5-12.2 9.3z'
                />
                <path
                  id='Layer'
                  fillRule='evenodd'
                  style={{ fill: '#3d3f3f' }}
                  d='m38.1 107.3h-7.2c0.9-5.3 4.6-7.9 11.1-7.9 7.9 0 11.8 2.6 12 7.9v9.7c0 7.9-4.7 11.4-12.4 11.9-6.8 0.5-11.6-2.6-11.6-8.9 0.2-6.8 5.1-8.7 12.3-9.4 3.1-0.4 4.6-1.3 4.6-2.9-0.2-1.6-1.7-2.4-4.6-2.4-2.5 0-3.9 0.7-4.2 2zm9 9.4v-2.6c-1.7 0.7-3.6 1.3-5.7 1.7-2.9 0.5-4.3 1.9-4.3 4 0.2 2.3 1.3 3.3 3.6 3.3 4 0 6.4-2.4 6.4-6.4z'
                />
                <path
                  id='Layer'
                  style={{ fill: '#3d3f3f' }}
                  d='m57.5 113.7c0.2-9.2 5.1-13.8 14.6-13.8h1v7.4h-2.4c-4 0-6 2.1-6 6.2v14.8h-7.3v-14.6z'
                />
                <path
                  id='Layer'
                  fillRule='evenodd'
                  style={{ fill: '#3d3f3f' }}
                  d='m83.6 103.9q0.1-0.2 0.2-0.3v0.3zm8.1-4.4c7.6 0.3 11.4 5.2 11.4 14.9q0 14.2-13.2 14.4c-8.9 0.1-13.3-4.2-13.3-12.8v-24.3h3.6q3.6 0 3.6 3.6v8.3c1.8-2.8 4.4-4.1 7.9-4.1zm-8.1 14.6q-0.2 8.7 6 8.7c4.1 0 6.1-2.9 6.1-8.7-0.2-5.5-2.2-8.2-6-8.2-3.9 0-5.9 2.7-6.1 8.2z'
                />
                <path
                  id='Layer'
                  fillRule='evenodd'
                  style={{ fill: '#3d3f3f' }}
                  d='m131.9 114.3c0 9.8-4.4 14.7-13 14.7-8.6 0-12.9-5-12.9-14.7 0-9.9 4.3-14.8 12.9-14.8 8.7 0 13 4.9 13 14.8zm-18.6 0c0.1 5.5 1.9 8.3 5.6 8.3 3.7 0 5.5-2.9 5.5-8.6 0-5.5-1.8-8.3-5.5-8.3-3.7 0.1-5.6 2.9-5.6 8.6z'
                />
                <path
                  id='Layer'
                  style={{ fill: '#3d3f3f' }}
                  d='m156 128.4c-2.4-0.2-3.6-1.3-3.6-3.6v-14.6c-0.2-3-1.8-4.4-5-4.4-3.2 0-4.8 1.5-4.8 4.4v18.2h-7.3v-16.7c0-8.1 4.1-12.2 12.2-12.2 8.1 0 12.1 4 12.1 12.2v16.7z'
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
export function World({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 33 33'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M16.0269 28.1074C22.6543 28.1074 28.0269 22.7348 28.0269 16.1074C28.0269 9.48 22.6543 4.10742 16.0269 4.10742C9.39944 4.10742 4.02686 9.48 4.02686 16.1074C4.02686 22.7348 9.39944 28.1074 16.0269 28.1074Z'
        stroke={color}
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.22705 23.0324L7.73955 22.1199C7.8702 22.0359 7.98058 21.9239 8.06271 21.792C8.14485 21.6602 8.19671 21.5118 8.21455 21.3574L8.67705 16.7324C8.68865 16.5761 8.74031 16.4255 8.82705 16.2949L11.2896 12.4324C11.3663 12.3125 11.4679 12.2103 11.5873 12.1327C11.7068 12.0551 11.8415 12.004 11.9823 11.9827C12.1231 11.9614 12.2669 11.9704 12.404 12.0092C12.541 12.0479 12.6682 12.1155 12.7771 12.2074L14.7021 13.8199C14.8077 13.9106 14.9315 13.9776 15.0652 14.0164C15.1989 14.0552 15.3393 14.0649 15.4771 14.0449L19.3771 13.5199C19.6159 13.487 19.8341 13.3668 19.9896 13.1824L22.7645 9.98243C22.9291 9.78737 23.0139 9.53736 23.0021 9.28243L22.8646 6.24493'
        stroke={color}
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M23.4144 25.5699L22.0644 24.2199C21.9395 24.0951 21.7845 24.0047 21.6144 23.9574L18.9269 23.2574C18.6909 23.1928 18.4867 23.0439 18.3531 22.8389C18.2195 22.6338 18.1657 22.3869 18.2019 22.1449L18.4894 20.1199C18.518 19.9496 18.5891 19.7892 18.6962 19.6538C18.8032 19.5183 18.9428 19.412 19.1019 19.3449L22.9019 17.7574C23.0784 17.6838 23.2723 17.6623 23.4606 17.6956C23.649 17.7288 23.8238 17.8153 23.9644 17.9449L27.0769 20.7949'
        stroke={color}
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
export function DownArrow({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 22 12'
      fill={color}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M21.9252 0.612505C21.8487 0.430504 21.72 0.275219 21.5554 0.166221C21.3908 0.0572224 21.1976 -0.000612701 21.0002 4.8951e-06H1.0002C0.802771 -0.000612701 0.609581 0.0572224 0.444971 0.166221C0.280361 0.275219 0.151697 0.430504 0.0751958 0.612505C0.00315034 0.797216 -0.0151266 0.99855 0.0224791 1.19321C0.0600848 1.38788 0.152036 1.56792 0.287696 1.7125L10.2877 11.7125C10.4788 11.8973 10.7343 12.0006 11.0002 12.0006C11.2661 12.0006 11.5216 11.8973 11.7127 11.7125L21.7127 1.7125C21.8484 1.56792 21.9403 1.38788 21.9779 1.19321C22.0155 0.99855 21.9972 0.797216 21.9252 0.612505Z'
        fill={color}
      />
    </svg>
  );
}
export function CheckMark({ color = 'none', height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill={color}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.10938 18.8906C4.24688 18.0281 4.81875 16.2187 4.37813 15.1594C3.9375 14.1 2.25 13.1719 2.25 12C2.25 10.8281 3.91875 9.9375 4.37813 8.84063C4.8375 7.74375 4.24688 5.97187 5.10938 5.10938C5.97187 4.24688 7.78125 4.81875 8.84063 4.37813C9.9 3.9375 10.8281 2.25 12 2.25C13.1719 2.25 14.0625 3.91875 15.1594 4.37813C16.2562 4.8375 18.0281 4.24688 18.8906 5.10938C19.7531 5.97187 19.1813 7.78125 19.6219 8.84063C20.0625 9.9 21.75 10.8281 21.75 12C21.75 13.1719 20.0813 14.0625 19.6219 15.1594C19.1625 16.2562 19.7531 18.0281 18.8906 18.8906C18.0281 19.7531 16.2187 19.1813 15.1594 19.6219C14.1 20.0625 13.1719 21.75 12 21.75C10.8281 21.75 9.9375 20.0813 8.84063 19.6219C7.74375 19.1625 5.97187 19.7531 5.10938 18.8906Z'
        stroke='#90A4AE'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M16.125 9.75L10.6219 15L7.875 12.375'
        stroke='#2E7D32'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
export function Ruler({ color, height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M15.2166 2.77879L2.78033 15.215C2.48744 15.5079 2.48744 15.9828 2.78033 16.2757L7.71969 21.2151C8.01259 21.5079 8.48746 21.5079 8.78035 21.2151L21.2166 8.77881C21.5095 8.48592 21.5095 8.01105 21.2166 7.71815L16.2772 2.77879C15.9843 2.4859 15.5095 2.4859 15.2166 2.77879Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.375 5.625L15.375 8.625'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9 9L12 12'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5.625 12.375L8.625 15.375'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
export function ToteSimple({ color, height = '20', width = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 21 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M17.0704 17.0383H4.44538C4.29159 17.0376 4.14332 16.9809 4.0283 16.8788C3.91327 16.7767 3.83936 16.6363 3.82038 16.4836L2.711 6.48364C2.70113 6.39651 2.70971 6.30828 2.73618 6.22469C2.76264 6.14109 2.8064 6.06399 2.86461 5.99842C2.92282 5.93284 2.99418 5.88024 3.07405 5.84405C3.15391 5.80785 3.2405 5.78887 3.32819 5.78833H18.1876C18.2752 5.78887 18.3618 5.80785 18.4417 5.84405C18.5216 5.88024 18.5929 5.93284 18.6511 5.99842C18.7094 6.06399 18.7531 6.14109 18.7796 6.22469C18.806 6.30828 18.8146 6.39651 18.8048 6.48364L17.6954 16.4836C17.6764 16.6363 17.6025 16.7767 17.4875 16.8788C17.3724 16.9809 17.2242 17.0376 17.0704 17.0383V17.0383Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.63477 5.78833C7.63477 4.95953 7.96401 4.16467 8.55006 3.57862C9.13611 2.99257 9.93096 2.66333 10.7598 2.66333C11.5886 2.66333 12.3834 2.99257 12.9695 3.57862C13.5555 4.16467 13.8848 4.95953 13.8848 5.78833'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
export function Layout({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.125 8.125V16.25'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M2.5 8.125H17.5'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M16.875 3.75H3.125C2.77982 3.75 2.5 4.02982 2.5 4.375V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V4.375C17.5 4.02982 17.2202 3.75 16.875 3.75Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}
export function Leaf({ color, width = '20', height = '20' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12.5 7.5L3.125 16.875'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4.99974 15.0001C1.24974 8.75007 6.24974 2.50007 16.8747 3.12507C17.4997 13.7501 11.2497 18.7501 4.99974 15.0001Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
export function CalendarBlank({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M16.25 3.125H3.75C3.40482 3.125 3.125 3.40482 3.125 3.75V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V3.75C16.875 3.40482 16.5952 3.125 16.25 3.125Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13.75 1.875V4.375'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M6.25 1.875V4.375'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M3.125 6.875H16.875'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}
export function Leaf_green({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M12.5 7.5L3.125 16.875'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M4.99974 15C1.24974 8.75001 6.24974 2.50001 16.8747 3.12501C17.4997 13.75 11.2497 18.75 4.99974 15Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function Factory({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M6.85547 13.8907H9.04297'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M12.168 13.8907H14.3555'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M17.4805 17.0157V10.7657H13.7305L8.73047 7.01575V10.7657L3.73047 7.01575V17.0157'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M1.85547 17.0157H19.3555'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M17.4805 10.7657L16.3086 2.55481C16.2879 2.40569 16.2141 2.26905 16.1007 2.17001C15.9873 2.07098 15.842 2.0162 15.6914 2.01575H14.2695C14.119 2.0162 13.9737 2.07098 13.8603 2.17001C13.7469 2.26905 13.673 2.40569 13.6523 2.55481L12.5977 9.922'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}
export function Database_Violet({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M10 10C13.797 10 16.875 8.32107 16.875 6.25C16.875 4.17893 13.797 2.5 10 2.5C6.20304 2.5 3.125 4.17893 3.125 6.25C3.125 8.32107 6.20304 10 10 10Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M3.125 6.25V10C3.125 12.0703 6.20313 13.75 10 13.75C13.7969 13.75 16.875 12.0703 16.875 10V6.25'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M3.125 10V13.75C3.125 15.8203 6.20313 17.5 10 17.5C13.7969 17.5 16.875 15.8203 16.875 13.75V10'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}
export function Database_orange({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M10 10C13.797 10 16.875 8.32107 16.875 6.25C16.875 4.17893 13.797 2.5 10 2.5C6.20304 2.5 3.125 4.17893 3.125 6.25C3.125 8.32107 6.20304 10 10 10Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M3.125 6.25V10C3.125 12.0703 6.20313 13.75 10 13.75C13.7969 13.75 16.875 12.0703 16.875 10V6.25'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M3.125 10V13.75C3.125 15.8203 6.20313 17.5 10 17.5C13.7969 17.5 16.875 15.8203 16.875 13.75V10'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function FishSimple({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M12.1875 7.1875C12.8779 7.1875 13.4375 6.62786 13.4375 5.9375C13.4375 5.24714 12.8779 4.6875 12.1875 4.6875C11.4971 4.6875 10.9375 5.24714 10.9375 5.9375C10.9375 6.62786 11.4971 7.1875 12.1875 7.1875Z'
          fill={color}
        />
        <path
          d='M1.25 14.375C19.3594 18.3359 17.4844 5.8984 16.9687 3.51559C16.9421 3.39729 16.8825 3.28897 16.7967 3.20322C16.711 3.11748 16.6027 3.05783 16.4844 3.03121C14.1016 2.51559 1.66406 0.64059 5.625 18.75'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M15.7274 11.875C14.7247 11.8887 13.7294 11.7012 12.8004 11.3235C11.8715 10.9458 11.0277 10.3857 10.319 9.67628C9.61026 8.96683 9.05101 8.12246 8.6743 7.19311C8.2976 6.26377 8.11109 5.26831 8.12581 4.26562'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function Cube({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M17.5 13.8515V6.14841C17.4994 6.03714 17.4695 5.928 17.4132 5.83199C17.357 5.73597 17.2764 5.65648 17.1797 5.60154L10.3047 1.73435C10.2121 1.68087 10.107 1.65271 10 1.65271C9.89303 1.65271 9.78795 1.68087 9.69531 1.73435L2.82031 5.60154C2.72356 5.65648 2.643 5.73597 2.58676 5.83199C2.53052 5.928 2.5006 6.03714 2.5 6.14841V13.8515C2.5006 13.9628 2.53052 14.072 2.58676 14.168C2.643 14.264 2.72356 14.3435 2.82031 14.3984L9.69531 18.2656C9.78795 18.3191 9.89303 18.3472 10 18.3472C10.107 18.3472 10.2121 18.3191 10.3047 18.2656L17.1797 14.3984C17.2764 14.3435 17.357 14.264 17.4132 14.168C17.4695 14.072 17.4994 13.9628 17.5 13.8515V13.8515Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M17.4141 5.82812L10.0703 10L2.58594 5.82812'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M10.0703 10L10 18.3438'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function Stack({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M2.5 13.75L10 18.125L17.5 13.75'
          stroke={color}
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M2.5 10L10 14.375L17.5 10'
          stroke={color}
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M2.5 6.25L10 10.625L17.5 6.25L10 1.875L2.5 6.25Z'
          stroke={color}
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function Flag({ color = 'none', width = '30', height = '30' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='16' cy='16' r='16' fill='#66BB6A' />
      <path
        opacity='0.2'
        d='M9.125 19.125C14.125 15.375 17.875 22.875 22.875 19.125V9.75001C17.875 13.5 14.125 6.00001 9.125 9.75001V19.125Z'
        fill='white'
      />
      <path
        d='M9.125 22.875V9.75'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.125 19.125C14.125 15.375 17.875 22.875 22.875 19.125V9.75001C17.875 13.5 14.125 6.00001 9.125 9.75001'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function Calendar_check({ color = 'none', width = '30', height = '30' }: IProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='16' cy='16' r='16' fill='#66BB6A' />
      <path
        opacity='0.2'
        d='M9.125 12.875H22.875V9.75C22.875 9.58424 22.8092 9.42527 22.6919 9.30806C22.5747 9.19085 22.4158 9.125 22.25 9.125H9.75C9.58424 9.125 9.42527 9.19085 9.30806 9.30806C9.19085 9.42527 9.125 9.58424 9.125 9.75V12.875Z'
        fill='white'
      />
      <path
        d='M22.25 9.125H9.75C9.40482 9.125 9.125 9.40482 9.125 9.75V22.25C9.125 22.5952 9.40482 22.875 9.75 22.875H22.25C22.5952 22.875 22.875 22.5952 22.875 22.25V9.75C22.875 9.40482 22.5952 9.125 22.25 9.125Z'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M19.75 7.875V10.375'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.25 7.875V10.375'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.125 12.875H22.875'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18.8125 16L15.1641 19.4375L13.1875 17.5625'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function Person({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M10.9531 18.0479C15.0953 18.0479 18.4531 14.69 18.4531 10.5479C18.4531 6.40572 15.0953 3.04785 10.9531 3.04785C6.81099 3.04785 3.45312 6.40572 3.45312 10.5479C3.45312 14.69 6.81099 18.0479 10.9531 18.0479Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M10.9531 13.0479C12.679 13.0479 14.0781 11.6487 14.0781 9.92285C14.0781 8.19696 12.679 6.79785 10.9531 6.79785C9.22724 6.79785 7.82812 8.19696 7.82812 9.92285C7.82812 11.6487 9.22724 13.0479 10.9531 13.0479Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M5.9375 16.126C6.40774 15.1997 7.12528 14.4218 8.01058 13.8784C8.89588 13.335 9.91436 13.0474 10.9531 13.0474C11.9919 13.0474 13.0104 13.335 13.8957 13.8784C14.781 14.4218 15.4985 15.1997 15.9687 16.126'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function ChartLine({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M17.5 16.25H2.5V3.75'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M17.5 7.5L12.5 11.875L7.5 8.125L2.5 12.5'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function DownloadSimple({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M6.71875 8.59375L10 11.875L13.2812 8.59375'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M10 3.125V11.875'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M16.875 11.875V16.25C16.875 16.4158 16.8092 16.5748 16.6919 16.692C16.5747 16.8092 16.4158 16.875 16.25 16.875H3.75C3.58424 16.875 3.42527 16.8092 3.30806 16.692C3.19085 16.5748 3.125 16.4158 3.125 16.25V11.875'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function Files({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M13.125 17.5H4.375C4.20924 17.5 4.05027 17.4342 3.93306 17.3169C3.81585 17.1997 3.75 17.0408 3.75 16.875V5.625C3.75 5.45924 3.81585 5.30027 3.93306 5.18306C4.05027 5.06585 4.20924 5 4.375 5H10.625L13.75 8.125V16.875C13.75 17.0408 13.6842 17.1997 13.5669 17.3169C13.4497 17.4342 13.2908 17.5 13.125 17.5Z'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M6.25 5V3.125C6.25 2.95924 6.31585 2.80027 6.43306 2.68306C6.55027 2.56585 6.70924 2.5 6.875 2.5H13.125L16.25 5.625V14.375C16.25 14.5408 16.1842 14.6997 16.0669 14.8169C15.9497 14.9342 15.7908 15 15.625 15H13.75'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M6.875 11.875H10.625'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M6.875 14.375H10.625'
          stroke={color}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  );
}

export function ClipBoard({ color, width = '16', height = '18' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 23 28'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M16.1465 17.1463C16.1465 17.4116 16.0411 17.6659 15.8536 17.8534C15.6661 18.041 15.4117 18.1463 15.1465 18.1463H7.14648C6.88127 18.1463 6.62691 18.041 6.43938 17.8534C6.25184 17.6659 6.14648 17.4116 6.14648 17.1463C6.14648 16.8811 6.25184 16.6268 6.43938 16.4392C6.62691 16.2517 6.88127 16.1463 7.14648 16.1463H15.1465C15.4117 16.1463 15.6661 16.2517 15.8536 16.4392C16.0411 16.6268 16.1465 16.8811 16.1465 17.1463ZM15.1465 12.1463H7.14648C6.88127 12.1463 6.62691 12.2517 6.43938 12.4392C6.25184 12.6268 6.14648 12.8811 6.14648 13.1463C6.14648 13.4116 6.25184 13.6659 6.43938 13.8534C6.62691 14.041 6.88127 14.1463 7.14648 14.1463H15.1465C15.4117 14.1463 15.6661 14.041 15.8536 13.8534C16.0411 13.6659 16.1465 13.4116 16.1465 13.1463C16.1465 12.8811 16.0411 12.6268 15.8536 12.4392C15.6661 12.2517 15.4117 12.1463 15.1465 12.1463ZM22.1465 4.14633V25.1463C22.1465 25.6768 21.9358 26.1855 21.5607 26.5605C21.1856 26.9356 20.6769 27.1463 20.1465 27.1463H2.14648C1.61605 27.1463 1.10734 26.9356 0.732271 26.5605C0.357198 26.1855 0.146484 25.6768 0.146484 25.1463V4.14633C0.146484 3.6159 0.357198 3.10719 0.732271 2.73212C1.10734 2.35705 1.61605 2.14633 2.14648 2.14633H6.67898C7.24087 1.51724 7.92927 1.01391 8.69915 0.669281C9.46902 0.324658 10.303 0.146515 11.1465 0.146515C11.99 0.146515 12.8239 0.324658 13.5938 0.669281C14.3637 1.01391 15.0521 1.51724 15.614 2.14633H20.1465C20.6769 2.14633 21.1856 2.35705 21.5607 2.73212C21.9358 3.10719 22.1465 3.6159 22.1465 4.14633ZM7.14648 6.14633H15.1465C15.1465 5.08547 14.7251 4.06805 13.9749 3.31791C13.2248 2.56776 12.2074 2.14633 11.1465 2.14633C10.0856 2.14633 9.0682 2.56776 8.31806 3.31791C7.56791 4.06805 7.14648 5.08547 7.14648 6.14633ZM20.1465 4.14633H16.8027C17.0302 4.7886 17.1465 5.46497 17.1465 6.14633V7.14633C17.1465 7.41155 17.0411 7.6659 16.8536 7.85344C16.6661 8.04098 16.4117 8.14633 16.1465 8.14633H6.14648C5.88127 8.14633 5.62691 8.04098 5.43938 7.85344C5.25184 7.6659 5.14648 7.41155 5.14648 7.14633V6.14633C5.14651 5.46497 5.26276 4.7886 5.49023 4.14633H2.14648V25.1463H20.1465V4.14633Z'
          fill='#8E24AA'
        />
      </svg>
    </span>
  );
}

export function SunCloud({ color, width = '22', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 29 26'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M18.6464 6.14635C17.7907 6.14583 16.9389 6.26061 16.1139 6.4876C15.7882 5.95622 15.3926 5.47104 14.9377 5.04509L16.1264 3.34885C16.2018 3.24124 16.2552 3.11985 16.2836 2.99161C16.312 2.86336 16.3149 2.73078 16.2921 2.60141C16.2693 2.47205 16.2213 2.34844 16.1507 2.23766C16.0801 2.12687 15.9884 2.03107 15.8808 1.95572C15.7732 1.88037 15.6518 1.82696 15.5236 1.79853C15.3953 1.77009 15.2627 1.7672 15.1334 1.79001C15.004 1.81282 14.8804 1.86088 14.7696 1.93146C14.6588 2.00204 14.563 2.09374 14.4877 2.20134L13.2989 3.89635C12.3214 3.40277 11.2415 3.14586 10.1464 3.14635C10.0739 3.14635 10.0014 3.14635 9.92891 3.14635L9.56766 1.11009C9.5487 0.977415 9.50327 0.8499 9.43405 0.735128C9.36483 0.620355 9.27325 0.520668 9.16475 0.44199C9.05624 0.363312 8.93303 0.307248 8.80243 0.277131C8.67183 0.247013 8.53651 0.243457 8.4045 0.266672C8.2725 0.289888 8.14651 0.339402 8.03403 0.412272C7.92154 0.485142 7.82485 0.579881 7.7497 0.690859C7.67455 0.801837 7.62248 0.926789 7.59657 1.05829C7.57067 1.18979 7.57147 1.32516 7.59891 1.45634L7.95891 3.49885C6.84986 3.86567 5.85 4.50373 5.05016 5.35509L3.34766 4.16385C3.24015 4.08665 3.11837 4.03156 2.98941 4.00178C2.86044 3.972 2.72684 3.96812 2.59637 3.99037C2.46589 4.01261 2.34112 4.06054 2.22931 4.13137C2.11749 4.20219 2.02085 4.29452 1.94499 4.40298C1.86912 4.51144 1.81554 4.63388 1.78736 4.76321C1.75917 4.89253 1.75694 5.02616 1.7808 5.15636C1.80465 5.28655 1.85411 5.41071 1.92631 5.52165C1.99852 5.63258 2.09202 5.72807 2.20141 5.8026L3.89641 6.99259C3.40109 7.96995 3.14409 9.05065 3.14641 10.1463C3.14641 10.2176 3.14641 10.2901 3.14641 10.3613L1.11016 10.7213C0.863696 10.7645 0.642371 10.8985 0.489879 11.0969C0.337387 11.2953 0.264809 11.5436 0.286472 11.7929C0.308134 12.0422 0.422464 12.2743 0.606892 12.4434C0.79132 12.6125 1.03244 12.7063 1.28266 12.7063C1.3409 12.7063 1.39902 12.7012 1.45641 12.6913L3.49641 12.3313C3.67565 12.8771 3.92169 13.3985 4.22891 13.8838C3.2724 14.7723 2.60558 15.9282 2.31529 17.201C2.025 18.4738 2.12469 19.8045 2.60138 21.0198C3.07807 22.2351 3.90967 23.2788 4.98788 24.0148C6.06609 24.7508 7.34094 25.1451 8.64641 25.1463H18.6464C21.166 25.1463 23.5823 24.1455 25.3639 22.3639C27.1455 20.5823 28.1464 18.1659 28.1464 15.6463C28.1464 13.1268 27.1455 10.7104 25.3639 8.92883C23.5823 7.14724 21.166 6.14635 18.6464 6.14635ZM5.14641 10.1463C5.14701 9.08741 5.48379 8.05602 6.10822 7.20078C6.73264 6.34555 7.61247 5.71065 8.62091 5.38757C9.62935 5.06449 10.7143 5.06992 11.7195 5.40307C12.7246 5.73623 13.5981 6.37991 14.2139 7.24135C12.174 8.31485 10.5922 10.0912 9.76141 12.2413C8.44684 12.0144 7.09429 12.1964 5.88641 12.7626C5.40282 11.9756 5.14668 11.07 5.14641 10.1463ZM18.6464 23.1463H8.64641C8.03094 23.1452 7.42225 23.0178 6.85796 22.7721C6.29368 22.5264 5.78581 22.1675 5.36574 21.7176C4.94568 21.2678 4.62236 20.7366 4.41577 20.1568C4.20918 19.5771 4.12372 18.9611 4.16466 18.347C4.20561 17.7329 4.37209 17.1337 4.65382 16.5865C4.93555 16.0393 5.32654 15.5557 5.80261 15.1656C6.27867 14.7755 6.8297 14.4872 7.42161 14.3186C8.01352 14.1499 8.63374 14.1045 9.24391 14.1851C9.19766 14.4813 9.16516 14.7838 9.14766 15.0888C9.14011 15.2202 9.1585 15.3517 9.20178 15.4759C9.24506 15.6001 9.31238 15.7146 9.3999 15.8128C9.48742 15.911 9.59342 15.991 9.71186 16.0482C9.83029 16.1055 9.95884 16.1388 10.0902 16.1463C10.2215 16.1539 10.353 16.1355 10.4772 16.0922C10.6014 16.049 10.7159 15.9816 10.8141 15.8941C10.9123 15.8066 10.9923 15.7006 11.0495 15.5822C11.1068 15.4637 11.1401 15.3352 11.1477 15.2038C11.1757 14.7051 11.2545 14.2104 11.3827 13.7276C11.3827 13.7076 11.3939 13.6876 11.3977 13.6676C11.7652 12.3169 12.5031 11.0959 13.5279 10.1424C14.5528 9.18887 15.8238 8.54089 17.1974 8.27159C18.5711 8.00229 19.9927 8.1224 21.3017 8.61836C22.6107 9.11431 23.755 9.96637 24.6053 11.0783C25.4556 12.1902 25.9782 13.5178 26.1139 14.911C26.2496 16.3042 25.9931 17.7076 25.3733 18.9627C24.7536 20.2179 23.7953 21.2747 22.6066 22.014C21.4179 22.7533 20.0462 23.1455 18.6464 23.1463Z'
          fill='#FF8F00'
        />
      </svg>
    </span>
  );
}

export function Tree({ color, width = '20', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 29 29'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M22.909 5.97134C22.1856 4.24414 20.9679 2.76926 19.4089 1.73198C17.8499 0.6947 16.0191 0.141296 14.1465 0.141296C12.274 0.141296 10.4432 0.6947 8.88414 1.73198C7.32511 2.76926 6.10741 4.24414 5.38402 5.97134C3.82722 6.69227 2.5079 7.8416 1.58039 9.28489C0.652881 10.7282 0.15553 12.4057 0.14652 14.1213C0.13277 18.9738 4.06652 23.0213 8.91402 23.1463C10.3804 23.1846 11.8338 22.8623 13.1465 22.2076V27.1463C13.1465 27.4116 13.2519 27.6659 13.4394 27.8534C13.627 28.041 13.8813 28.1463 14.1465 28.1463C14.4117 28.1463 14.6661 28.041 14.8536 27.8534C15.0412 27.6659 15.1465 27.4116 15.1465 27.1463V22.2076C16.3888 22.8271 17.7584 23.1485 19.1465 23.1463H19.379C24.2265 23.0213 28.1603 18.9763 28.1465 14.1238C28.1381 12.4078 27.6411 10.7296 26.7135 9.28582C25.786 7.84202 24.4663 6.69233 22.909 5.97134ZM19.3278 21.1463C17.8836 21.1866 16.4627 20.7759 15.2628 19.9713C15.2236 19.9463 15.1849 19.9226 15.1465 19.9001V14.7638L20.594 12.0413C20.7116 11.9826 20.8164 11.9012 20.9025 11.802C20.9886 11.7027 21.0543 11.5874 21.0958 11.4628C21.1374 11.3381 21.154 11.2065 21.1446 11.0754C21.1353 10.9443 21.1003 10.8164 21.0415 10.6988C20.9828 10.5813 20.9014 10.4765 20.8021 10.3904C20.7029 10.3043 20.5876 10.2386 20.463 10.197C20.3383 10.1555 20.2067 10.1389 20.0756 10.1482C19.9445 10.1575 19.8166 10.1926 19.699 10.2513L15.1465 12.5288V9.14634C15.1465 8.88112 15.0412 8.62677 14.8536 8.43923C14.6661 8.2517 14.4117 8.14634 14.1465 8.14634C13.8813 8.14634 13.627 8.2517 13.4394 8.43923C13.2519 8.62677 13.1465 8.88112 13.1465 9.14634V15.5288L8.59402 13.2513C8.35665 13.1327 8.08186 13.1131 7.83009 13.197C7.57832 13.281 7.3702 13.4615 7.25152 13.6988C7.13284 13.9362 7.11331 14.211 7.19723 14.4628C7.28115 14.7145 7.46165 14.9227 7.69902 15.0413L13.1465 17.7638V19.8963C13.1074 19.9188 13.0686 19.9426 13.0303 19.9676C11.8304 20.7728 10.4098 21.1848 8.96527 21.1463C7.3843 21.1068 5.8633 20.5332 4.65003 19.5188C3.43677 18.5044 2.60276 17.109 2.28386 15.5601C1.96496 14.0111 2.17998 12.3998 2.89387 10.9886C3.60777 9.57745 4.77847 8.44962 6.21527 7.78884C6.66969 7.58064 7.02897 7.20886 7.22152 6.74759C7.79232 5.38342 8.75366 4.21843 9.98469 3.39908C11.2157 2.57972 12.6615 2.14257 14.1403 2.14257C15.619 2.14257 17.0648 2.57972 18.2958 3.39908C19.5269 4.21843 20.4882 5.38342 21.059 6.74759C21.2516 7.20886 21.6109 7.58064 22.0653 7.78884C23.5021 8.44962 24.6728 9.57745 25.3867 10.9886C26.1006 12.3998 26.3156 14.0111 25.9967 15.5601C25.6778 17.109 24.8438 18.5044 23.6305 19.5188C22.4172 20.5332 20.8962 21.1068 19.3153 21.1463H19.3278Z'
          fill='#2B9348'
        />
      </svg>
    </span>
  );
}

export function Plant({ color, width = '26', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 31 25'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M30.1001 1.13257C30.0858 0.887923 29.9822 0.657043 29.8089 0.483759C29.6356 0.310475 29.4048 0.206853 29.1601 0.192567C22.6901 -0.182433 17.4951 1.78507 15.2626 5.47007C13.7876 7.90632 13.7901 10.8651 15.2426 13.6876C14.4159 14.6718 13.8116 15.8231 13.4714 17.0626L11.4376 15.0213C12.4151 12.9801 12.3776 10.8526 11.3126 9.08507C9.66261 6.36132 5.85386 4.90132 1.12511 5.17882C0.880465 5.1931 0.649585 5.29673 0.476301 5.47001C0.303017 5.64329 0.199396 5.87417 0.185109 6.11882C-0.0936412 10.8476 1.36761 14.6563 4.09136 16.3063C4.99019 16.8555 6.02305 17.1461 7.07636 17.1463C8.09873 17.1337 9.1052 16.8915 10.0214 16.4376L13.1464 19.5626V23.1463C13.1464 23.4115 13.2517 23.6659 13.4393 23.8534C13.6268 24.041 13.8811 24.1463 14.1464 24.1463C14.4116 24.1463 14.6659 24.041 14.8535 23.8534C15.041 23.6659 15.1464 23.4115 15.1464 23.1463V19.4601C15.1419 17.8692 15.6833 16.3249 16.6801 15.0851C17.9663 15.7572 19.3927 16.1169 20.8439 16.1351C22.2468 16.1396 23.6238 15.7563 24.8226 15.0276C28.5076 12.7976 30.4801 7.60257 30.1001 1.13257ZM5.12261 14.5963C3.20511 13.4351 2.12011 10.6863 2.14636 7.14632C5.68636 7.11632 8.43511 8.20507 9.59636 10.1226C10.2026 11.1226 10.3014 12.2888 9.90386 13.4901L6.85261 10.4388C6.66355 10.2592 6.4118 10.1605 6.15104 10.1639C5.89027 10.1672 5.64113 10.2723 5.45673 10.4567C5.27233 10.6411 5.16726 10.8902 5.16392 11.151C5.16058 11.4118 5.25924 11.6635 5.43886 11.8526L8.49011 14.9038C7.28886 15.3013 6.12386 15.2026 5.12261 14.5963ZM23.7864 13.3188C22.1114 14.3326 20.1426 14.4101 18.1426 13.5688L24.8539 6.85632C25.0335 6.66725 25.1321 6.4155 25.1288 6.15474C25.1255 5.89398 25.0204 5.64484 24.836 5.46044C24.6516 5.27604 24.4024 5.17097 24.1417 5.16763C23.8809 5.16429 23.6292 5.26295 23.4401 5.44257L16.7276 12.1463C15.8826 10.1463 15.9589 8.17632 16.9776 6.50257C18.7201 3.62757 22.8526 2.02507 28.1439 2.14882C28.2639 7.43882 26.6639 11.5763 23.7864 13.3188Z'
          fill='#4CAF50'
        />
      </svg>
    </span>
  );
}

export function Flower({ color, width = '15', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 23 29'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M21.1465 4.14635C19.6246 4.14497 18.1191 4.4613 16.7265 5.0751C14.839 1.90385 11.7365 0.325096 11.594 0.251346C11.4551 0.181825 11.3018 0.14563 11.1465 0.14563C10.9911 0.14563 10.8379 0.181825 10.699 0.251346C10.5565 0.323846 7.44898 1.90385 5.56648 5.0751C4.17384 4.4613 2.6684 4.14497 1.14648 4.14635C0.881268 4.14635 0.626914 4.2517 0.439378 4.43924C0.251841 4.62678 0.146484 4.88113 0.146484 5.14635V10.1463C0.149784 12.8896 1.17671 15.5329 3.02627 17.5588C4.87583 19.5848 7.41488 20.8476 10.1465 21.1001V25.5288L5.59398 23.2513C5.47645 23.1926 5.34849 23.1575 5.21742 23.1482C5.08634 23.1389 4.95472 23.1555 4.83005 23.1971C4.70539 23.2386 4.59013 23.3043 4.49086 23.3904C4.39159 23.4765 4.31025 23.5813 4.25148 23.6988C4.19272 23.8164 4.15768 23.9443 4.14836 24.0754C4.13905 24.2065 4.15564 24.3381 4.19719 24.4628C4.23875 24.5874 4.30445 24.7027 4.39055 24.802C4.47664 24.9012 4.58145 24.9826 4.69898 25.0413L10.699 28.0413C10.8379 28.1109 10.9911 28.1471 11.1465 28.1471C11.3018 28.1471 11.4551 28.1109 11.594 28.0413L17.594 25.0413C17.8314 24.9227 18.0119 24.7145 18.0958 24.4628C18.1797 24.211 18.1602 23.9362 18.0415 23.6988C17.9228 23.4615 17.7147 23.281 17.4629 23.1971C17.2111 23.1131 16.9364 23.1327 16.699 23.2513L12.1465 25.5288V21.1001C14.8781 20.8476 17.4171 19.5848 19.2667 17.5588C21.1163 15.5329 22.1432 12.8896 22.1465 10.1463V5.14635C22.1465 4.88113 22.0411 4.62678 21.8536 4.43924C21.6661 4.2517 21.4117 4.14635 21.1465 4.14635ZM10.1465 19.0913C7.94735 18.8427 5.91658 17.7936 4.44121 16.144C2.96585 14.4943 2.14905 12.3595 2.14648 10.1463V6.20135C4.34562 6.44998 6.37639 7.49909 7.85175 9.14873C9.32712 10.7984 10.1439 12.9332 10.1465 15.1463V19.0913ZM11.1465 10.5663C10.3052 8.73869 8.98096 7.17539 7.31648 6.0451C8.51273 4.07135 10.3165 2.8076 11.1465 2.2951C11.9777 2.8051 13.7815 4.06885 14.9765 6.0451C13.3123 7.17568 11.9881 8.73889 11.1465 10.5663ZM20.1465 10.1463C20.1439 12.3595 19.3271 14.4943 17.8518 16.144C16.3764 17.7936 14.3456 18.8427 12.1465 19.0913V15.1463C12.149 12.9332 12.9658 10.7984 14.4412 9.14873C15.9166 7.49909 17.9473 6.44998 20.1465 6.20135V10.1463Z'
          fill='#7B61FF'
        />
      </svg>
    </span>
  );
}

export function Rupee({ color, width = '12', height = '20' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 18 25'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M17.7502 5.99994C17.7502 6.19885 17.6712 6.38962 17.5305 6.53027C17.3899 6.67092 17.1991 6.74994 17.0002 6.74994H12.7114C12.737 6.99912 12.7499 7.24945 12.7502 7.49994C12.7479 9.42205 11.9833 11.2648 10.6242 12.6239C9.26503 13.983 7.42231 14.7476 5.5002 14.7499H2.9402L12.5002 23.4449C12.6474 23.5789 12.7354 23.7658 12.7447 23.9646C12.7541 24.1634 12.6841 24.3577 12.5502 24.5049C12.4163 24.6521 12.2293 24.7401 12.0306 24.7495C11.8318 24.7588 11.6374 24.6889 11.4902 24.5549L0.490196 14.5549C0.377816 14.4528 0.299089 14.319 0.264427 14.1711C0.229765 14.0233 0.240802 13.8684 0.296079 13.7269C0.351355 13.5855 0.448265 13.4641 0.573993 13.379C0.69972 13.2938 0.848341 13.2488 1.0002 13.2499H5.5002C7.02458 13.248 8.48597 12.6415 9.56387 11.5636C10.6418 10.4857 11.2482 9.02432 11.2502 7.49994C11.2494 7.24914 11.2327 6.99864 11.2002 6.74994H1.0002C0.801284 6.74994 0.610519 6.67092 0.469867 6.53027C0.329214 6.38962 0.250196 6.19885 0.250196 5.99994C0.250196 5.80103 0.329214 5.61026 0.469867 5.46961C0.610519 5.32896 0.801284 5.24994 1.0002 5.24994H10.7914C10.349 4.21262 9.6117 3.32801 8.6711 2.70583C7.7305 2.08366 6.62795 1.75128 5.5002 1.74994H1.0002C0.801284 1.74994 0.610519 1.67092 0.469867 1.53027C0.329214 1.38962 0.250196 1.19885 0.250196 0.999939C0.250196 0.801027 0.329214 0.610261 0.469867 0.469609C0.610519 0.328956 0.801284 0.249939 1.0002 0.249939H17.0002C17.1991 0.249939 17.3899 0.328956 17.5305 0.469609C17.6712 0.610261 17.7502 0.801027 17.7502 0.999939C17.7502 1.19885 17.6712 1.38962 17.5305 1.53027C17.3899 1.67092 17.1991 1.74994 17.0002 1.74994H9.90895C11.0692 2.64075 11.9343 3.86039 12.3914 5.24994H17.0002C17.1991 5.24994 17.3899 5.32896 17.5305 5.46961C17.6712 5.61026 17.7502 5.80103 17.7502 5.99994Z'
          fill='#4CAF50'
        />
      </svg>
    </span>
  );
}
export function Map({ color, width = '20', height = '18' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 26 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M25.615 2.21124C25.4952 2.1179 25.3557 2.05307 25.2072 2.02166C25.0586 1.99026 24.9048 1.99311 24.7575 2.02999L17.1162 3.93999L9.4475 0.104987C9.23383 -0.00158852 8.98908 -0.0281918 8.7575 0.029987L0.7575 2.02999C0.541161 2.08406 0.349103 2.2089 0.211853 2.38465C0.0746019 2.56041 3.37634e-05 2.77699 0 2.99999V21C2.30059e-05 21.1519 0.0346739 21.3019 0.101321 21.4384C0.167968 21.575 0.264859 21.6946 0.384633 21.7881C0.504408 21.8816 0.643916 21.9466 0.792562 21.9781C0.941209 22.0096 1.09508 22.0068 1.2425 21.97L8.88375 20.06L16.5525 23.895C16.6917 23.9636 16.8448 23.9995 17 24C17.0818 23.9999 17.1632 23.9899 17.2425 23.97L25.2425 21.97C25.4588 21.9159 25.6509 21.7911 25.7881 21.6153C25.9254 21.4396 26 21.223 26 21V2.99999C26 2.84789 25.9654 2.6978 25.8987 2.56112C25.8319 2.42444 25.7349 2.30477 25.615 2.21124ZM10 2.61749L16 5.61749V21.3825L10 18.3825V2.61749ZM2 3.78124L8 2.28124V18.2187L2 19.7187V3.78124ZM24 20.2187L18 21.7187V5.78124L24 4.28124V20.2187Z'
          fill='#3A7BFA'
        />
      </svg>
    </span>
  );
}

export function Engine({ color, width = '26', height = '18' }: IProps) {
  return (
    <span style={{ marginRight: '0.4rem' }}>
      <svg
        width={width}
        height={height}
        viewBox='0 0 32 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M31 9C30.7348 9 30.4804 9.10536 30.2929 9.29289C30.1054 9.48043 30 9.73478 30 10V13H28V11C28 10.4696 27.7893 9.96086 27.4142 9.58579C27.0391 9.21071 26.5304 9 26 9H24.4137L20 4.58625C19.815 4.39972 19.5947 4.25184 19.352 4.1512C19.1093 4.05056 18.849 3.99916 18.5863 4H16V2H19C19.2652 2 19.5196 1.89464 19.7071 1.70711C19.8946 1.51957 20 1.26522 20 1C20 0.734784 19.8946 0.48043 19.7071 0.292893C19.5196 0.105357 19.2652 0 19 0H11C10.7348 0 10.4804 0.105357 10.2929 0.292893C10.1054 0.48043 10 0.734784 10 1C10 1.26522 10.1054 1.51957 10.2929 1.70711C10.4804 1.89464 10.7348 2 11 2H14V4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V13H2V10C2 9.73478 1.89464 9.48043 1.70711 9.29289C1.51957 9.10536 1.26522 9 1 9C0.734784 9 0.48043 9.10536 0.292893 9.29289C0.105357 9.48043 0 9.73478 0 10L0 18C0 18.2652 0.105357 18.5196 0.292893 18.7071C0.48043 18.8946 0.734784 19 1 19C1.26522 19 1.51957 18.8946 1.70711 18.7071C1.89464 18.5196 2 18.2652 2 18V15H4V17.5863C3.99916 17.849 4.05056 18.1093 4.1512 18.352C4.25184 18.5947 4.39972 18.815 4.58625 19L9 23.4137C9.18504 23.6003 9.40532 23.7482 9.64802 23.8488C9.89072 23.9494 10.151 24.0008 10.4137 24H18.5863C18.849 24.0008 19.1093 23.9494 19.352 23.8488C19.5947 23.7482 19.815 23.6003 20 23.4137L24.4137 19H26C26.5304 19 27.0391 18.7893 27.4142 18.4142C27.7893 18.0391 28 17.5304 28 17V15H30V18C30 18.2652 30.1054 18.5196 30.2929 18.7071C30.4804 18.8946 30.7348 19 31 19C31.2652 19 31.5196 18.8946 31.7071 18.7071C31.8946 18.5196 32 18.2652 32 18V10C32 9.73478 31.8946 9.48043 31.7071 9.29289C31.5196 9.10536 31.2652 9 31 9ZM26 17H24.4137C24.151 16.9992 23.8907 17.0506 23.648 17.1512C23.4053 17.2518 23.185 17.3997 23 17.5863L18.5863 22H10.4137L6 17.5863V6H18.5863L23 10.4137C23.185 10.6003 23.4053 10.7482 23.648 10.8488C23.8907 10.9494 24.151 11.0008 24.4137 11H26V17Z'
          fill='#007DBB'
        />
      </svg>
    </span>
  );
}

export const ProductsBatchesIcon = React.memo(function HomeIcon(props: any) {
  return (
    <SvgIcon {...props} style={{ width: '20px', height: '20px' }}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 31 26' id='product-batches'>
        <path
          d='M28.75 0H6.75C6.28587 0 5.84075 0.184375 5.51256 0.512563C5.18437 0.840752 5 1.28587 5 1.75V19.75C5 20.2141 5.18437 20.6592 5.51256 20.9874C5.84075 21.3156 6.28587 21.5 6.75 21.5H28.75C29.2141 21.5 29.6592 21.3156 29.9874 20.9874C30.3156 20.6592 30.5 20.2141 30.5 19.75V1.75C30.5 1.28587 30.3156 0.840752 29.9874 0.512563C29.6592 0.184375 29.2141 0 28.75 0ZM6.75 1.5H28.75C28.8163 1.5 28.8799 1.52634 28.9268 1.57322C28.9737 1.62011 29 1.6837 29 1.75V4H6.5V1.75C6.5 1.6837 6.52634 1.62011 6.57322 1.57322C6.62011 1.52634 6.6837 1.5 6.75 1.5ZM28.75 20H6.75C6.6837 20 6.62011 19.9737 6.57322 19.9268C6.52634 19.8799 6.5 19.8163 6.5 19.75V5.5H29V19.75C29 19.8163 28.9737 19.8799 28.9268 19.9268C28.8799 19.9737 28.8163 20 28.75 20ZM23.5 8.75C23.5 10.275 22.8942 11.7375 21.8159 12.8159C20.7375 13.8942 19.275 14.5 17.75 14.5C16.225 14.5 14.7625 13.8942 13.6841 12.8159C12.6058 11.7375 12 10.275 12 8.75C12 8.55109 12.079 8.36032 12.2197 8.21967C12.3603 8.07902 12.5511 8 12.75 8C12.9489 8 13.1397 8.07902 13.2803 8.21967C13.421 8.36032 13.5 8.55109 13.5 8.75C13.5 9.87717 13.9478 10.9582 14.7448 11.7552C15.5418 12.5522 16.6228 13 17.75 13C18.8772 13 19.9582 12.5522 20.7552 11.7552C21.5522 10.9582 22 9.87717 22 8.75C22 8.55109 22.079 8.36032 22.2197 8.21967C22.3603 8.07902 22.5511 8 22.75 8C22.9489 8 23.1397 8.07902 23.2803 8.21967C23.421 8.36032 23.5 8.55109 23.5 8.75Z'
          stroke='currentColor'
          strokeWidth='1px'
        />
        <path
          d='M23.75 4H1.75C1.28587 4 0.840752 4.18437 0.512563 4.51256C0.184375 4.84075 0 5.28587 0 5.75V23.75C0 24.2141 0.184375 24.6592 0.512563 24.9874C0.840752 25.3156 1.28587 25.5 1.75 25.5H23.75C24.2141 25.5 24.6592 25.3156 24.9874 24.9874C25.3156 24.6592 25.5 24.2141 25.5 23.75V5.75C25.5 5.28587 25.3156 4.84075 24.9874 4.51256C24.6592 4.18437 24.2141 4 23.75 4ZM24 23.75C24 23.8163 23.9737 23.8799 23.9268 23.9268C23.8799 23.9737 23.8163 24 23.75 24H1.75C1.6837 24 1.62011 23.9737 1.57322 23.9268C1.52634 23.8799 1.5 23.8163 1.5 23.75V5.75C1.5 5.6837 1.52634 5.62011 1.57322 5.57322C1.62011 5.52634 1.6837 5.5 1.75 5.5H23.75C23.8163 5.5 23.8799 5.52634 23.9268 5.57322C23.9737 5.62011 24 5.6837 24 5.75V23.75Z'
          stroke='currentColor'
          strokeWidth='1px'
        />
      </svg>
    </SvgIcon>
  );
});

export const ProductIcon = React.memo(function HomeIcon(props: any) {
  return (
    <SvgIcon {...props} style={{ width: '20px', height: '20px' }}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 22' id='product'>
        <path
          d='M24 0.25H2C1.53587 0.25 1.09075 0.434375 0.762563 0.762563C0.434375 1.09075 0.25 1.53587 0.25 2V20C0.25 20.4641 0.434375 20.9092 0.762563 21.2374C1.09075 21.5656 1.53587 21.75 2 21.75H24C24.4641 21.75 24.9092 21.5656 25.2374 21.2374C25.5656 20.9092 25.75 20.4641 25.75 20V2C25.75 1.53587 25.5656 1.09075 25.2374 0.762563C24.9092 0.434375 24.4641 0.25 24 0.25ZM2 1.75H24C24.0663 1.75 24.1299 1.77634 24.1768 1.82322C24.2237 1.87011 24.25 1.9337 24.25 2V4.25H1.75V2C1.75 1.9337 1.77634 1.87011 1.82322 1.82322C1.87011 1.77634 1.9337 1.75 2 1.75ZM24 20.25H2C1.9337 20.25 1.87011 20.2237 1.82322 20.1768C1.77634 20.1299 1.75 20.0663 1.75 20V5.75H24.25V20C24.25 20.0663 24.2237 20.1299 24.1768 20.1768C24.1299 20.2237 24.0663 20.25 24 20.25ZM18.75 9C18.75 10.525 18.1442 11.9875 17.0659 13.0659C15.9875 14.1442 14.525 14.75 13 14.75C11.475 14.75 10.0125 14.1442 8.93414 13.0659C7.8558 11.9875 7.25 10.525 7.25 9C7.25 8.80109 7.32902 8.61032 7.46967 8.46967C7.61032 8.32902 7.80109 8.25 8 8.25C8.19891 8.25 8.38968 8.32902 8.53033 8.46967C8.67098 8.61032 8.75 8.80109 8.75 9C8.75 10.1272 9.19777 11.2082 9.9948 12.0052C10.7918 12.8022 11.8728 13.25 13 13.25C14.1272 13.25 15.2082 12.8022 16.0052 12.0052C16.8022 11.2082 17.25 10.1272 17.25 9C17.25 8.80109 17.329 8.61032 17.4697 8.46967C17.6103 8.32902 17.8011 8.25 18 8.25C18.1989 8.25 18.3897 8.32902 18.5303 8.46967C18.671 8.61032 18.75 8.80109 18.75 9Z'
          stroke='currentColor'
          strokeWidth='1px'
        />
      </svg>
    </SvgIcon>
  );
});

export const CowIcon = React.memo(function HomeIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' id='cow'>
        <g
          transform='translate(0.000000,64.000000) scale(0.100000,-0.100000)'
          fill='currentColor'
          stroke='currentColor'
          strokeWidth='8px'
        >
          <path
            d='M25 571 c-25 -28 -30 -139 -9 -189 10 -23 18 -77 21 -147 2 -60 8
-126 12 -145 6 -32 10 -35 44 -38 l36 -3 -2 53 c-2 43 1 53 15 56 15 3 18 -4
18 -40 0 -58 10 -70 51 -66 l34 3 -3 52 c-4 51 -3 53 22 53 25 0 29 -8 39 -90
1 -9 15 -16 36 -18 42 -4 57 9 42 36 -13 25 -3 82 15 82 9 0 14 -18 16 -57 l3
-58 40 0 40 0 -3 63 c-3 56 -1 66 17 78 12 9 21 21 21 29 0 7 11 26 24 42 14
17 25 46 28 76 4 35 12 52 32 68 30 24 34 44 9 53 -10 3 -25 10 -33 15 -8 5
-23 12 -32 15 -10 3 -18 14 -18 25 0 30 -19 35 -44 12 l-22 -21 -23 23 c-22
22 -22 22 -37 3 -8 -11 -14 -26 -14 -33 0 -7 -8 -13 -18 -13 -10 0 -24 -6 -30
-12 -8 -8 -55 -15 -128 -18 l-116 -5 -35 -39 c-41 -44 -53 -37 -53 32 0 36 4
45 20 49 25 7 52 55 44 77 -8 22 -37 20 -59 -3z m45 -7 c0 -16 -23 -44 -35
-44 -19 0 -19 15 1 34 15 16 34 21 34 10z m366 -61 c-10 -10 -19 5 -10 18 6
11 8 11 12 0 2 -7 1 -15 -2 -18z m84 11 c0 -8 -5 -12 -10 -9 -6 4 -8 11 -5 16
9 14 15 11 15 -7z m21 -53 c21 -22 29 -39 29 -66 0 -32 -3 -36 -20 -31 -11 3
-29 9 -40 12 -35 9 -22 -11 15 -25 45 -16 48 -51 6 -80 -50 -36 -114 -22 -142
30 -13 26 2 45 42 54 16 4 29 11 29 17 0 10 -27 6 -64 -8 -13 -5 -16 1 -16 34
0 33 6 45 31 66 43 36 91 35 130 -3z m-173 -16 c-12 -27 -23 -31 -33 -14 -4 6
1 17 11 24 28 21 35 18 22 -10z m246 -4 c3 -5 -1 -11 -9 -15 -13 -5 -35 20
-35 39 0 7 37 -12 44 -24z m-394 -14 c0 -12 -7 -33 -16 -45 -8 -12 -11 -22 -5
-22 15 0 41 42 41 67 0 34 44 30 86 -6 29 -26 31 -31 16 -36 -13 -4 -22 -24
-31 -69 -14 -71 -11 -83 27 -97 20 -8 31 -6 52 10 18 13 31 16 41 10 8 -5 30
-9 49 -9 32 0 33 -1 17 -17 -10 -11 -38 -18 -77 -21 l-60 -4 0 -40 c0 -35 -2
-39 -22 -36 -17 2 -24 12 -28 33 l-5 30 -96 3 -97 3 -6 -36 c-5 -26 -12 -35
-26 -35 -17 0 -20 7 -20 44 0 24 -3 64 -6 90 l-7 46 31 -6 c25 -5 35 -1 56 21
14 16 26 35 26 44 0 11 -9 5 -28 -17 -26 -31 -64 -43 -76 -23 -11 17 7 71 32
96 25 25 68 42 110 44 17 1 22 -5 22 -22z m144 -73 c3 -9 4 -20 1 -25 -3 -4 1
-22 10 -38 8 -17 15 -34 15 -39 0 -16 -30 -23 -51 -11 -17 9 -19 17 -14 57 4
26 8 53 10 60 6 17 22 15 29 -4z m106 -209 c0 -28 -4 -35 -20 -35 -11 0 -20 6
-20 14 0 8 -3 21 -6 29 -5 14 6 21 39 26 4 0 7 -15 7 -34z m-250 -10 c0 -18
-5 -25 -20 -25 -15 0 -20 7 -20 25 0 18 5 25 20 25 15 0 20 -7 20 -25z m-110
-55 c0 -5 -9 -10 -20 -10 -11 0 -20 5 -20 10 0 6 9 10 20 10 11 0 20 -4 20
-10z m115 0 c4 -6 -5 -10 -19 -10 -14 0 -26 5 -26 10 0 6 9 10 19 10 11 0 23
-4 26 -10z m140 0 c4 -6 -5 -10 -19 -10 -14 0 -26 5 -26 10 0 6 9 10 19 10 11
0 23 -4 26 -10z m110 0 c4 -6 -5 -10 -19 -10 -14 0 -26 5 -26 10 0 6 9 10 19
10 11 0 23 -4 26 -10z'
          />
          <path
            d='M420 410 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z'
          />
          <path
            d='M430 311 c0 -6 5 -13 10 -16 6 -3 10 1 10 9 0 9 -4 16 -10 16 -5 0
-10 -4 -10 -9z'
          />
          <path d='M501 304 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z' />
          <path
            d='M205 310 c-3 -5 -10 -8 -14 -6 -4 3 -17 -2 -29 -10 -24 -17 -29 -53
-10 -72 16 -16 55 -15 65 2 4 7 18 19 31 25 34 18 27 65 -10 69 -14 2 -29 -2
-33 -8z m45 -23 c0 -19 -59 -60 -76 -53 -27 11 -16 45 19 55 46 13 57 13 57
-2z'
          />
        </g>
      </svg>
    </SvgIcon>
  );
});

export const GoatIcon = React.memo(function HomeIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' id='goat'>
        <g
          transform='translate(0.000000,64.000000) scale(0.100000,-0.100000)'
          fill='currentColor'
          stroke='currentColor'
          strokeWidth='8px'
        >
          <path
            d='M380 564 c0 -4 17 -23 37 -43 l37 -36 -32 -3 c-36 -4 -38 -8 -16 -40
15 -21 15 -25 -2 -43 -20 -22 -97 -25 -222 -9 -59 8 -82 16 -113 41 -35 27
-40 29 -46 13 -3 -10 1 -30 10 -46 15 -27 15 -32 2 -51 -20 -29 -19 -56 5
-117 15 -38 17 -56 10 -70 -16 -30 -12 -68 13 -105 21 -33 25 -35 80 -35 31 0
57 2 57 5 0 4 -7 20 -16 36 -19 38 -12 64 13 51 24 -12 43 -4 43 18 0 22 5 25
48 35 30 6 32 5 32 -20 0 -14 10 -49 21 -76 l21 -49 59 0 c33 0 59 2 59 5 0 2
-9 28 -20 56 -24 59 -19 109 9 109 26 0 29 7 18 48 -9 34 -7 43 16 78 15 21
27 34 27 28 0 -13 38 -54 50 -54 6 0 10 13 10 29 0 16 7 34 15 41 8 7 15 18
15 24 0 14 -147 159 -177 174 -23 13 -63 16 -63 6z m95 -54 c18 -19 23 -30 14
-29 -15 0 -67 59 -52 59 5 0 22 -13 38 -30z m-10 -60 c-3 -5 -12 -10 -20 -10
-8 0 -17 5 -20 10 -4 6 5 10 20 10 15 0 24 -4 20 -10z m98 -26 c21 -19 35 -39
32 -44 -4 -6 -23 -10 -44 -10 -34 0 -39 -4 -66 -49 -17 -27 -33 -47 -38 -44
-4 2 -17 23 -28 45 l-21 41 49 48 c26 27 55 48 63 48 8 0 32 -15 53 -35z
m-494 -18 c8 -9 8 -16 2 -20 -6 -4 -15 3 -21 14 -12 23 2 27 19 6z m204 -43
l107 -6 19 -42 c10 -23 24 -46 30 -49 6 -4 8 -12 5 -18 -13 -21 -12 -123 2
-156 17 -42 18 -52 2 -52 -16 0 -45 70 -54 128 -4 23 -10 42 -14 42 -4 0 -27
-7 -51 -16 -42 -15 -100 -14 -156 2 -18 5 -25 1 -34 -22 -5 -16 -17 -36 -25
-46 -14 -14 -14 -20 0 -47 19 -37 20 -41 3 -41 -8 0 -22 15 -32 34 -16 29 -17
40 -7 71 9 31 8 45 -9 86 -10 28 -19 60 -19 72 1 44 48 80 95 72 17 -3 78 -8
138 -12z m297 -28 c0 -8 -2 -15 -4 -15 -2 0 -6 7 -10 15 -3 8 -1 15 4 15 6 0
10 -7 10 -15z m-100 -110 c0 -8 -4 -15 -10 -15 -5 0 -10 7 -10 15 0 8 5 15 10
15 6 0 10 -7 10 -15z m-257 -62 c10 -6 9 -33 -2 -33 -5 0 -11 6 -14 13 -3 9
-10 7 -24 -6 -20 -17 -21 -17 -25 0 -8 32 2 43 30 37 15 -4 30 -9 35 -11z
m153 -10 c6 -30 18 -67 29 -95 5 -12 3 -18 -6 -18 -17 0 -49 75 -49 113 0 35
18 35 26 0z m-216 -65 c23 -39 25 -48 7 -48 -15 0 -49 64 -40 74 10 10 12 8
33 -26z'
          />
          <path d='M502 428 c6 -18 28 -21 28 -4 0 9 -7 16 -16 16 -9 0 -14 -5 -12 -12z' />
        </g>
      </svg>
    </SvgIcon>
  );
});

export const SheepIcon = React.memo(function HomeIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' id='sheep'>
        <g
          transform='translate(0.000000,64.000000) scale(0.100000,-0.100000)'
          fill='currentColor'
          stroke='currentColor'
          strokeWidth='8px'
        >
          <path
            d='M436 611 c-4 -6 -16 -11 -26 -11 -24 0 -50 -26 -50 -51 0 -34 -36
-63 -77 -62 -21 1 -46 -3 -56 -9 -10 -5 -33 -10 -50 -10 -56 0 -103 -27 -119
-67 -41 -97 -41 -101 -28 -129 7 -15 12 -37 11 -49 -3 -24 31 -63 54 -63 11 0
15 -12 15 -45 0 -65 17 -95 53 -95 24 0 28 3 21 18 -15 34 -17 112 -2 113 7 1
27 3 43 5 30 3 80 4 143 2 31 -1 32 -3 32 -44 0 -64 17 -94 53 -94 24 0 28 3
21 17 -4 10 -9 37 -12 61 -3 35 0 47 19 67 67 69 83 104 81 181 -1 35 2 40 20
40 32 -1 45 27 30 67 -7 19 -10 47 -7 63 6 33 2 41 -41 71 -36 25 -118 41
-128 24z m49 -21 c4 -6 15 -8 25 -5 11 3 22 0 27 -8 4 -8 17 -16 28 -18 26 -5
33 -47 9 -56 -9 -3 -25 -1 -35 5 -10 7 -25 9 -34 6 -10 -4 -15 0 -15 15 0 12
-4 21 -8 21 -9 0 -102 -105 -102 -115 0 -9 68 -1 93 9 12 6 17 4 17 -7 0 -9
10 -17 23 -19 16 -2 22 -10 22 -30 1 -15 4 -30 8 -34 12 -12 8 -41 -7 -53 -7
-6 -11 -22 -8 -37 3 -20 0 -26 -17 -31 -11 -3 -21 -13 -21 -22 0 -38 -46 -54
-70 -26 -12 14 -15 14 -30 0 -18 -16 -46 -20 -54 -7 -6 10 -66 10 -81 0 -14
-8 -102 -5 -111 4 -4 4 -18 5 -31 2 -33 -9 -56 13 -49 47 3 17 0 32 -9 39 -17
14 -19 33 -6 58 11 21 27 62 35 85 3 9 14 17 25 17 11 0 22 4 25 9 3 5 26 7
50 6 32 -2 46 1 50 12 4 8 17 13 33 12 59 -4 81 1 86 21 3 11 12 20 20 20 10
0 15 10 13 33 -1 27 3 33 24 35 14 2 29 8 35 13 12 12 32 11 40 -1z m-28 -127
c-27 -28 -40 -9 -15 22 20 25 23 27 26 11 2 -10 -3 -25 -11 -33z m131 0 c6 -9
12 -28 12 -41 0 -35 -36 -22 -90 32 -11 11 -20 24 -20 29 0 15 84 -2 98 -20z
m-438 -349 c0 -19 -4 -34 -10 -34 -5 0 -10 18 -10 41 0 24 4 38 10 34 6 -3 10
-22 10 -41z m290 0 c0 -19 -4 -34 -10 -34 -5 0 -10 18 -10 41 0 24 4 38 10 34
6 -3 10 -22 10 -41z m-280 -64 c0 -5 -4 -10 -10 -10 -5 0 -10 5 -10 10 0 6 5
10 10 10 6 0 10 -4 10 -10z m290 0 c0 -5 -4 -10 -10 -10 -5 0 -10 5 -10 10 0
6 5 10 10 10 6 0 10 -4 10 -10z'
          />
          <path
            d='M530 460 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z'
          />
        </g>
      </svg>
    </SvgIcon>
  );
});

export const PoultryIcon = React.memo(function HomeIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' id='poultry'>
        <g
          transform='translate(0.000000,64.000000) scale(0.100000,-0.100000)'
          fill='currentColor'
          stroke='currentColor'
          strokeWidth='8px'
        >
          <path
            d='M127 572 c-23 -11 -28 -20 -26 -45 1 -18 -2 -41 -6 -51 -6 -13 -4
-21 3 -24 7 -2 12 -12 12 -21 0 -10 3 -21 7 -25 4 -3 6 -29 4 -56 -3 -63 21
-104 83 -144 25 -16 46 -34 46 -41 0 -7 9 -20 20 -30 27 -25 22 -58 -10 -65
-16 -4 -21 -8 -13 -13 22 -14 53 11 53 43 0 34 12 44 41 35 30 -10 22 -57 -11
-66 -22 -5 -23 -7 -7 -14 10 -4 23 -3 29 3 6 6 18 8 27 5 13 -5 14 -3 4 8 -23
24 -14 44 47 104 70 69 119 151 115 192 -3 32 -22 83 -30 83 -4 0 -22 -12 -41
-26 -30 -23 -41 -26 -91 -22 -55 5 -59 7 -110 64 -29 32 -52 66 -52 74 1 8 1
20 0 26 -2 18 -62 21 -94 6z m81 -20 c2 -7 -8 -12 -26 -12 -17 0 -37 -7 -46
-15 -9 -9 -17 -11 -21 -5 -8 14 3 30 21 30 8 0 14 4 14 8 0 12 53 7 58 -6z
m47 -89 c77 -86 149 -106 219 -58 40 27 51 31 40 14 -3 -6 -1 -15 7 -19 10 -7
10 -11 -1 -25 -10 -13 -11 -18 -2 -24 18 -11 -38 -107 -96 -165 -50 -48 -50
-48 -79 -32 -15 9 -49 24 -74 35 -61 25 -115 74 -129 117 -10 28 -9 44 4 83
11 35 13 57 6 81 -12 41 3 63 34 54 12 -3 43 -31 71 -61z m-125 17 c0 -5 -5
-10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4 -4 4 -10z m6 -57 c-10 -10
-19 5 -10 18 6 11 8 11 12 0 2 -7 1 -15 -2 -18z m166 -275 c-11 -11 -32 -3
-32 12 0 4 9 6 21 3 13 -4 17 -9 11 -15z'
          />
          <path d='M167 504 c-8 -8 1 -24 14 -24 5 0 9 7 9 15 0 15 -12 20 -23 9z' />
          <path
            d='M226 379 c-67 -53 5 -159 112 -162 26 -1 40 6 58 26 13 15 27 27 32
27 24 0 58 69 35 70 -5 0 -25 4 -45 9 -21 5 -38 5 -38 0 0 -4 16 -11 35 -15
19 -3 38 -10 40 -15 9 -14 -43 -42 -70 -37 -28 6 -34 -6 -7 -17 16 -6 16 -7
-2 -21 -27 -19 -50 -18 -96 6 -54 28 -77 63 -61 96 6 14 20 28 31 31 11 3 20
9 20 14 0 15 -16 10 -44 -12z'
          />
        </g>
      </svg>
    </SvgIcon>
  );
});

export const AquaIcon = React.memo(function HomeIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' id='aqua'>
        <g
          transform='translate(0.000000,64.000000) scale(0.100000,-0.100000)'
          fill='currentColor'
          stroke='currentColor'
          strokeWidth='8px'
        >
          <path
            d='M220 588 c0 -12 9 -32 21 -44 13 -14 17 -24 10 -28 -6 -4 -16 2 -23
14 -15 23 -28 26 -28 6 0 -18 38 -46 54 -40 7 3 18 -6 24 -20 19 -42 58 -60
146 -66 63 -4 81 -8 81 -20 0 -24 -127 -36 -157 -16 -27 19 -68 21 -68 3 0 -7
7 -23 16 -35 15 -21 15 -25 0 -41 -9 -10 -16 -23 -16 -29 0 -7 -8 -12 -17 -12
-10 0 -41 -11 -69 -24 -51 -24 -52 -24 -71 -4 -11 11 -39 22 -62 25 -35 5 -41
3 -41 -13 0 -25 36 -84 52 -84 6 0 0 -13 -15 -28 -15 -15 -30 -42 -33 -60 -6
-30 -5 -32 23 -32 17 0 45 10 64 23 l34 23 55 -25 c46 -22 69 -26 145 -26 112
1 178 22 237 76 l43 39 -43 39 c-44 40 -102 65 -180 77 -65 10 -38 22 60 26
82 3 89 5 119 34 38 38 48 94 26 146 -26 63 -52 72 -217 78 l-145 5 -3 28 c-4
32 -22 37 -22 5z m302 -88 c-4 -35 -40 -70 -74 -70 -25 0 -28 3 -23 20 8 26
-2 25 -24 -2 -17 -20 -21 -21 -51 -8 -28 12 -70 61 -70 83 0 4 55 6 123 5
l122 -3 -3 -25z m71 -55 c2 -23 -3 -31 -26 -39 -21 -8 -31 -7 -42 5 -14 14
-13 20 7 57 22 40 24 41 41 24 10 -10 19 -31 20 -47z m-3 -68 c0 -15 -36 -57
-49 -57 -5 0 -14 7 -21 15 -10 12 -10 18 0 29 10 13 21 17 63 25 4 0 7 -5 7
-12z m-250 -17 c10 -6 12 -12 4 -20 -7 -7 -16 -5 -29 10 -14 15 -15 20 -4 20
8 0 21 -5 29 -10z m160 -31 c11 -19 9 -20 -27 -17 -27 2 -39 8 -41 21 -5 26
54 24 68 -4z m-90 -5 c0 -10 -7 -14 -22 -12 -32 5 -35 28 -4 28 17 0 26 -5 26
-16z m-60 -22 c0 -13 -23 -32 -39 -32 -11 0 -10 4 4 20 19 21 35 26 35 12z
m109 -66 c5 -3 4 -24 -2 -46 -8 -29 -8 -52 0 -81 13 -51 8 -54 -112 -54 -79 0
-96 3 -142 28 -53 27 -72 58 -60 92 6 14 70 51 117 66 25 9 183 4 199 -5z
m-354 -19 c25 -21 27 -57 3 -57 -13 0 -68 56 -68 69 0 19 38 12 65 -12z m423
-11 c15 -8 36 -23 46 -35 19 -21 19 -21 0 -42 -20 -22 -66 -49 -83 -49 -14 0
-24 64 -17 105 8 39 14 41 54 21z m-403 -83 c8 -21 -36 -63 -66 -63 -27 0 -24
17 10 51 34 33 46 36 56 12z'
          />
          <path
            d='M330 500 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z'
          />
          <path
            d='M269 203 c-12 -31 -7 -109 8 -124 7 -7 24 -4 49 6 38 15 39 16 39 65
0 48 -1 50 -38 65 -48 19 -46 20 -58 -12z m55 -9 c25 -10 22 -81 -4 -89 -11
-3 -24 -3 -30 0 -14 9 -13 32 3 38 9 4 9 8 -2 15 -8 6 -11 17 -8 26 7 17 16
19 41 10z'
          />
          <path
            d='M530 160 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
-10 -4 -10 -10z'
          />
          <path
            d='M80 442 c-19 -11 -42 -31 -50 -46 -14 -26 -14 -28 12 -50 14 -13 28
-34 30 -47 3 -22 7 -24 68 -24 61 0 65 2 68 24 2 13 15 33 29 45 69 60 -69
146 -157 98z m118 -22 c41 -25 50 -47 26 -65 -27 -20 -36 -18 -29 5 3 11 2 20
-4 20 -5 0 -13 -9 -16 -20 -9 -28 -25 -25 -25 5 0 14 -4 25 -10 25 -5 0 -10
-11 -10 -25 0 -30 -16 -33 -25 -5 -3 11 -11 20 -16 20 -6 0 -7 -9 -4 -20 7
-23 -2 -25 -29 -5 -24 18 -15 40 26 65 42 25 74 25 116 0z m-8 -112 c0 -9 -17
-13 -50 -13 -33 0 -50 4 -50 13 0 8 17 12 50 12 33 0 50 -4 50 -12z'
          />
        </g>
      </svg>
    </SvgIcon>
  );
});