import Introduction from './Introduction';
import Trending from './Trending';
import React from 'react';

export default function Home() {
    return (
        <React.Fragment>
            <Introduction />
            <Trending />
        </React.Fragment>
    )
}