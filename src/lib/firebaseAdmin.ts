import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccount = {
  projectId: "remunavoicerkl",
  clientEmail: "firebase-adminsdk-fbsvc@remunavoicerkl.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCh/askphslcc00\nsNmwJ5DvXkguOwVPJdHFTUUSEU9+zTum8ajIqYkK2kgZ64deHZmmU2MTUw1RVIh5\nNXhd73VjR/8JJcfjjPDNvn8RvrtTf9TRyZG8jev/gpKu1xwQZHkJ1ofZQzkmA7zV\ncQ8RdEHAetnzRqSXgawKws3Yd5XvKfzG+QgNk/wPC0PXVmGQv16XwJV2EXtPvbd3\nP6N9JkZXwl95t/lc/DYuxkvkFFybZ30BKI5emycKaYTCoZvbFdsEkwyL7lNpflWZ\nA4O+dudRxuo+NBP7MbEVltgHbt8QmItBX0/mi59m3pKdz9XCZeA/tyOddzMLcL3e\nY3gBGQfZAgMBAAECggEAAOOnMPkQUve3Q03xF5vcwgz5uUxLbvbbjg3hmQJ49flH\nGMH8K/G8sifCKHOB2cUF/wSS6NeR3VM1P662keMQFJzKjoUxHH/Dj/Bw1mZsFqAa\nobANvuoQTME/7TQAms6TWLffT8hwRg34433idPhk2okLQjt0Xk9EoSUc1ybpMgcc\nezyt48QIaykv92OHkOIkx5EFFZR4dNYVv0KMRcAkrSnUYcjjWMGb7d6jvmP5yX8N\nFpkKO5O9VC8vzGsa8H6IKpd6X6XdCrfnxpVcwEGQdZsJIZuzGOXAZ+Yj9EciCsp4\nOJsoglXZE4Fk37gFDGka1mCcVPLKHMWK+GTS2/G25QKBgQDif9zQl1+i5U9CsSm0\n1GvxZSKbN4KDlylSfbK2HCKuOm3LYd7ZT9JTiJNikaCWfkQynHRtkaijVsHucqeR\nPfJn5BtBbqa/bmPMTYRlFBQLdjqJWrA/yFfIrSO3U901M1A0hLJldEcalbwmJe0d\n4p1IAJMWdLc7M1oRLFLI9NKNdQKBgQC3FugMFDEMioYqd4prvai9bckHlTPWQRoF\n+Tr9g/URU8B3Qu8ZNLHscJRqdPe1lN74vwf1XPBhAhfFfQ0gQQduok0BiQN9PMyk\nTuWXgyc20PAS3uiUeHRLgy0rTCLdYSQkd6wheDkHBI6obhE4RnpKdlco/rcqe27l\nh5yJZh3QVQKBgDdb7QqGlPdpeI/iYUEzUha0E1tAnAOxpIXm9xEPm2JeIYu+JguT\nOOL11KAY29ksj1qXZtWI7mDNyaSQHWigbWj7FbZOZy8OuhGrOJrD54pNoU0E/2L3\ngo0n1DzwoHZqTkYn0Lp/SwmyY0QnrObLBoocqdapPEeZ63+bB7jaLcQpAoGAUW1r\nmGumgNhe4SY3NsGr+UuJW8j8u+5KP5vfo357kNA5yhDHu+MWunw7VbldrbFfFSwI\nwxQpiEtg/SEnpE+nmYmvS95+4cUXkn/QVnkrCJMWIp5mvBlyR184yIfc/a5FX76l\nnGEWo8tgEwKYv/mAS/ujugTGu6sX4BdXBDiZS90CgYBTwwHRSOA6K7fBkUwyN6mH\n3X6XZoS9Wz7YtiLh38jCzhYWy2sZcIsfp+ForjeXiTGB3E1cA3gZIguiVNDR1n8b\nPjmVegu7PysPD2Dsw6qddO7x1b1TRhouvVpU5Ax1jJ4+6boYCUlk1g89qydN4f01\n1XeN116trHt544bxnFsSGg==\n-----END PRIVATE KEY-----\n",
  
};

const adminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0];

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminMessaging = getMessaging(adminApp);
