import { useSelector, useDispatch } from 'react-redux';

/**
 * 获取认证相关的状态和操作
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  
  return {
    user: auth.user,
    token: auth.token,
    balance: auth.balance,
    isAuthenticated: auth.isAuthenticated,
    loading: false,
    dispatch,
  };
};

/**
 * 获取生成相关的状态和操作
 */
export const useGeneration = () => {
  const dispatch = useDispatch();
  const generation = useSelector((state) => state.generation);
  
  return {
    isGenerating: generation.isGenerating,
    generationType: generation.generationType,
    dispatch,
  };
};

/**
 * 获取作品相关的状态和操作
 */
export const useWorks = () => {
  const dispatch = useDispatch();
  const works = useSelector((state) => state.works);
  
  return {
    lyrics: works.lyrics,
    music: works.music,
    dispatch,
  };
};
