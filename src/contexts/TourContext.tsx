'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { driver, DriveStep, Driver, Config } from 'driver.js';
import { useRouter, usePathname } from 'next/navigation';
import { tours, TourId, TourStep, getFilteredTourSteps } from '@/config/tourSteps';
import api from '@/utils/api';
import 'driver.js/dist/driver.css';

interface TourContextValue {
  startTour: (tourId: TourId) => void;
  stopTour: () => void;
  isTourActive: boolean;
  hasSeenTour: (tourId: TourId) => boolean;
  markTourAsSeen: (tourId: TourId) => void;
  resetTours: () => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

const STORAGE_KEY = 'fesi_tours_seen';

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [driverInstance, setDriverInstance] = useState<Driver | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [toursSeenState, setToursSeenState] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();

  // Load tours seen from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setToursSeenState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tours seen data', e);
      }
    }
  }, []);

  const hasSeenTour = useCallback((tourId: TourId): boolean => {
    return toursSeenState[tourId] === true;
  }, [toursSeenState]);

  const markTourAsSeen = useCallback((tourId: TourId) => {
    const updated = { ...toursSeenState, [tourId]: true };
    setToursSeenState(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [toursSeenState]);

  const resetTours = useCallback(() => {
    setToursSeenState({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const stopTour = useCallback(() => {
    if (driverInstance) {
      driverInstance.destroy();
      setDriverInstance(null);
    }
    setIsTourActive(false);
  }, [driverInstance]);

  const startTour = useCallback(async (tourId: TourId) => {
    const tourConfig = tours[tourId];
    if (!tourConfig) {
      console.error(`Tour "${tourId}" not found`);
      return;
    }

    // Stop any existing tour
    stopTour();

    // Fetch merchant data to filter tour steps
    let merchantData = null;
    try {
      const response = await api.get('/api/merchants/me');
      merchantData = response.data;
      console.log('Tour: Merchant operating mode:', merchantData?.operating_mode);
    } catch (error) {
      console.error('Failed to fetch merchant data for tour:', error);
    }

    // Filter steps based on merchant data
    const tourSteps = getFilteredTourSteps(tourConfig, merchantData) as TourStep[];
    console.log(`Tour has ${tourSteps.length} steps after filtering`);

    let currentStepIndex = 0;

    // Convert custom TourSteps to Driver steps
    const driverSteps: DriveStep[] = tourSteps.map((step) => ({
      element: step.element,
      popover: step.popover,
    }));

    // Driver.js configuration
    const driverConfig: Config = {
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: driverSteps,
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Done!',
      progressText: '{{current}} of {{total}}',
      smoothScroll: true,
      animate: true,
      popoverOffset: 10,
      stagePadding: 10,
      allowClose: true,
      onDestroyed: () => {
        setIsTourActive(false);
        markTourAsSeen(tourId);
      },
      onHighlightStarted: () => {
        // Wait for scroll animation to complete before refreshing position
        setTimeout(() => {
          if (newDriver) {
            newDriver.refresh();
          }
        }, 400);
      },
      onNextClick: async () => {
        const nextIndex = currentStepIndex + 1;
        
        if (nextIndex < tourSteps.length) {
          const nextStep = tourSteps[nextIndex];
          
          // Check if we need to navigate to a different page
          if (nextStep.page && pathname !== nextStep.page) {
            // Pause driver, navigate, then resume
            newDriver.destroy();
            router.push(nextStep.page);
            
            // Wait for navigation and DOM update
            setTimeout(() => {
              currentStepIndex = nextIndex;
              newDriver.drive(nextIndex);
            }, nextStep.actionDelay || 500);
          } else {
            currentStepIndex = nextIndex;
            newDriver.moveNext();
          }
        } else {
          newDriver.destroy();
        }
      },
      onPrevClick: () => {
        if (currentStepIndex > 0) {
          const prevIndex = currentStepIndex - 1;
          const prevStep = tourSteps[prevIndex];
          
          // Check if we need to navigate back
          if (prevStep.page && pathname !== prevStep.page) {
            newDriver.destroy();
            router.push(prevStep.page);
            
            setTimeout(() => {
              currentStepIndex = prevIndex;
              newDriver.drive(prevIndex);
            }, prevStep.actionDelay || 500);
          } else {
            currentStepIndex = prevIndex;
            newDriver.movePrevious();
          }
        }
      },
    };

    const newDriver = driver(driverConfig);
    setDriverInstance(newDriver);
    setIsTourActive(true);

    // Start the tour
    const firstStep = tourSteps[0];
    if (firstStep.page && pathname !== firstStep.page) {
      router.push(firstStep.page);
      setTimeout(() => {
        newDriver.drive();
      }, firstStep.actionDelay || 500);
    } else {
      newDriver.drive();
    }
  }, [pathname, router, stopTour, markTourAsSeen]);

  // Auto-start onboarding tour for new users
  useEffect(() => {
    // Only on merchant pages
    if (!pathname?.startsWith('/merchant')) return;
    
    // Check if this is a new user (hasn't seen onboarding)
    const hasSeenOnboarding = hasSeenTour('onboarding');
    
    if (!hasSeenOnboarding && !isTourActive) {
      // Small delay to let the page load
      const timer = setTimeout(() => {
        startTour('onboarding');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, hasSeenTour, isTourActive, startTour]);

  const value: TourContextValue = {
    startTour,
    stopTour,
    isTourActive,
    hasSeenTour,
    markTourAsSeen,
    resetTours,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
