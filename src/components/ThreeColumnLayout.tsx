import { AriaAttributes, ComponentPropsWithoutRef, createContext, CSSProperties, ReactNode, useContext } from "react";

interface NestedThreeColumnLayoutProps extends ComponentPropsWithoutRef<"div">, AriaAttributes {
  layoutLevel: "nested";
  gap?: string;
  maxWidth?: never;
  children: ReactNode;
};

interface RootThreeColumnLayoutProps extends ComponentPropsWithoutRef<"div">, AriaAttributes {
  layoutLevel: "root";
  gap?: string;
  maxWidth?: string;
  children: ReactNode;
};

interface ColumnProps extends ComponentPropsWithoutRef<"div">, AriaAttributes {
  columnPercent?: number;
  minWidth?: string;
  children: ReactNode;
}

type ThreeColumnLayoutContext = {
  gap: string;
};
const ThreeColumnContext = createContext<ThreeColumnLayoutContext>({gap: "0px"});

export default function ThreeColumnLayout({
  layoutLevel,
  gap = "0px",
  maxWidth = "1700px",
  children,
  ...props
}: NestedThreeColumnLayoutProps | RootThreeColumnLayoutProps) {
  
  const baseLayoutStyles : CSSProperties = {
    display: "flex",
    width: "100%",
    gap: gap,
    flexWrap: "wrap",
    maxWidth: "none"
  }

  const rootLayoutStyles : CSSProperties = {
    marginInline: "auto",
    maxWidth: maxWidth
  }
  
  return (
    <ThreeColumnContext.Provider value={{gap: gap}}>
      <div
        style={layoutLevel == "root" ? {...baseLayoutStyles, ...rootLayoutStyles} : {...baseLayoutStyles,} }
        {...props}
      >
        {children}
      </div>
    </ThreeColumnContext.Provider>
  );
}

// Control when ThreeColumnLayout starts wrapping and unwrapping by changing the pixel value in 'min-w-[300px]'
const LeftColumn = ({
  columnPercent = 33.33,
  minWidth = "33ch",
  children,
  ...props
}: ColumnProps) => {
  const { gap } = useContext(ThreeColumnContext)
  
  return (
    <div
      style={{
        flexBasis: `calc(${columnPercent}% - (${gap} * 2 / 3))`,
        minWidth: `${minWidth}`,
        flexGrow: 1,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const MiddleColumn = ({
  columnPercent = 33.33,
  minWidth = "33ch",
  children,
  ...props
}: ColumnProps) => {
  const { gap } = useContext(ThreeColumnContext)
  
  return (
    <div
      style={{
        flexBasis: `calc(${columnPercent}% - (${gap} * 2 / 3))`,
        minWidth: `${minWidth}`,
        flexGrow: 1,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const RightColumn = ({
  columnPercent = 33.33,
  minWidth = "33ch",
  children,
  ...props
}: ColumnProps) => {
  const { gap } = useContext(ThreeColumnContext)
  
  return (
    <div
      style={{
        flexBasis: `calc(${columnPercent}% - (${gap} * 2 / 3))`,
        minWidth: `${minWidth}`,
        flexGrow: 1,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

ThreeColumnLayout.LeftColumn = LeftColumn;
ThreeColumnLayout.MiddleColumn = MiddleColumn;
ThreeColumnLayout.RightColumn = RightColumn;
