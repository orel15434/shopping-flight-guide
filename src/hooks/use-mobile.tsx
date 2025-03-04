
import * as React from "react"

// Mobile breakpoints
const MOBILE_BREAKPOINT = 640
const VERY_SMALL_SCREEN_BREAKPOINT = 400
const EXTRA_SMALL_SCREEN_BREAKPOINT = 320 // Lowered from 340 to 320 for even smaller screens

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check initially
    checkIfMobile()
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}

// Function to check if we're on a very small screen
export function useIsVerySmallScreen() {
  const [isVerySmallScreen, setIsVerySmallScreen] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfVerySmallScreen = () => {
      setIsVerySmallScreen(window.innerWidth < VERY_SMALL_SCREEN_BREAKPOINT)
    }
    
    // Check initially
    checkIfVerySmallScreen()
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfVerySmallScreen)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfVerySmallScreen)
  }, [])

  return isVerySmallScreen
}

// Function to check if we're on an extra small screen
export function useIsExtraSmallScreen() {
  const [isExtraSmallScreen, setIsExtraSmallScreen] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfExtraSmallScreen = () => {
      setIsExtraSmallScreen(window.innerWidth < EXTRA_SMALL_SCREEN_BREAKPOINT)
    }
    
    // Check initially
    checkIfExtraSmallScreen()
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfExtraSmallScreen)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfExtraSmallScreen)
  }, [])

  return isExtraSmallScreen
}
