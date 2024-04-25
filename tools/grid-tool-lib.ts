import { flatten, uniq, uniqBy } from 'lodash';

/**
 * This function takes an easy-to-read and easy-to-write multi-line
 * string and interprets as a layout grid specification and returns a
 * tree object representing a MUI layout.
 *
 * Example specification:
 *
 *     Logo:2 > TitleArea:8 > RightMenu:2
 *     LeftMenu:4 > MainArea:8
 *     Footer:12
 *
 * This layout has three rows
 * The first one has three elements, Logo, TitleArea, RightMenu.
 * Logo uses two "xs" columns, TitleArea uses 8 and RightMenu uses 2.
 *
 * The second row has two elements, LeftMenu with 4 columns and
 * MainArea with 8.
 *
 * The third row has a single column with 12 cols.
 *
 * How to use:
 *
 *   import { grid } from "./grid-tool-lib"
 *   import { render} from "../rtml";
 *   const layoutstr = `...` // specification
 *   const layout = grid(layoutstr)
 *   const jsx = render(grid.toObject())
 *   // now jsx variable has the code required for this layout.
 *   // Write to a file or console, whatever.
 */
export const grid = (_spec: string) => {
  let spec: any = joinRows(_spec.split(/[,\n]/).filter(filterOutComments).map(gRow));
  let setProps: any = (props: any) => {
    spec = {
      ...spec,
      props: { ...spec.props, ...props },
    };
    return setProps;
  };

  // Convert to object for codegen
  setProps.toObject = () => spec;

  // This is a little tricky - returning the setProps allows
  // chaining - you can keep setting properties, and you keep
  // getting a new grid object
  return setProps;
};

// Private code

const trim = (s: string): string => s.trim();

const makeGridItem = ([name, width]: [string, string]) => ({
  tag: 'Grid',
  props: { xs: +width, item: true },
  children: [{ tag: name }],
});
const makeItem = (itemspec: any) => makeGridItem(itemspec.split(':'));

const gRow = (str: string) => str.split(/[>]/).map(trim).map(makeItem);

const joinRows = (rows: any[]) => ({
  tag: 'Grid',
  props: {
    container: true,
  },
  children: flatten(rows),
});

const filterOutComments = (s: string): boolean => !/\s*\#.*$/.test(s);

export const layoutToolInterpret = (specstr: string) => {
  const spec = grid(specstr).toObject();
  spec.name = 'Root';
  return spec;
};
