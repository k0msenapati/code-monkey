import { cookies } from "next/headers"

const getTraits = async () => {
    const cookieStore = await cookies()
    const currentUserCookie = cookieStore.get('currentUser')?.value
    
    if (!currentUserCookie) {
      return {}
    }
    
    try {
      const userData = JSON.parse(currentUserCookie)
      return {
        userId: userData.id,
        username: userData.username,
        email: userData.email,
        isPremium: userData.premium,
      }
    } catch (error) {
      console.error("Failed to parse user cookie for traits:", error)
      return {}
    }
}

export default getTraits;