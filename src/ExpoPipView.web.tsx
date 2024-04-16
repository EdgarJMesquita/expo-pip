import * as React from 'react';

import { ExpoPipViewProps } from './ExpoPip.types';

export default function ExpoPipView(props: ExpoPipViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
