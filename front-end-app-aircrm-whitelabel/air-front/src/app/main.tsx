/**
 * AIR Ecosystem — Store Management Platform (AIR Dashboard)
 * Copyright (c) 2024–2026 AIR Ecosystem. All Rights Reserved.
 * Proprietary and confidential — do not copy, modify, or distribute.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Providers } from './providers'

import './styles/fonts.css'

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers />
    </BrowserRouter>
  </StrictMode>
)
