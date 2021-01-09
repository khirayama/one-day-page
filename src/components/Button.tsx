import * as React from 'react';

export function Button(props: {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button className="px-2 py-0.5 focus:border-0 focus:outline-none" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
