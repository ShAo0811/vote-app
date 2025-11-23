const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9876';

export async function checkArknightsPersonalUnlock(userId) {
  try {
    const response = await fetch(`${BASE_URL}/arknights/check_personal_unlock?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('请求失败');
    }
    return await response.json();
  } catch (error) {
    console.error('查询失败:', error);
    return { unlocked: false };
  }
}
