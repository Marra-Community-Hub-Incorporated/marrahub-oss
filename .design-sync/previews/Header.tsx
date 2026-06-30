import React from 'react';
import { Header } from 'marrahub-website';

// Header takes no props — it renders the sticky site navigation. The router
// provider supplies the route context it reads via useLocation.
export const Default = () => <Header />;
