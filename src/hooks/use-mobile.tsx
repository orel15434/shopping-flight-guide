
import * as React from "react"

// Lowering the mobile breakpoint to better match actual mobile devices
const MOBILE_BREAKPOINT = 640

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

// Add a function to check if we're on a very small screen
export function useIsVerySmallScreen() {
  const [isVerySmallScreen, setIsVerySmallScreen] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfVerySmallScreen = () => {
      setIsVerySmallScreen(window.innerWidth < 400)
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
