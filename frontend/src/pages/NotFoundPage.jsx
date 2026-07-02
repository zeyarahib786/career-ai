import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
const NotFoundPage = () => {
  const { isAr } = useTranslation();
  return (
    <main style={{ minHeight:'100svh', display:'flex', alignItems:'center', justifyContent:'center',
                   flexDirection:'column', gap:'16px', paddingBlockStart:'var(--nh)', textAlign:'center' }}>
      <span style={{ fontFamily:'var(--f-mono)', fontSize:'.5rem', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--em)' }}>404</span>
      <h1 style={{ fontSize:'2rem', fontWeight:800, color:'var(--t1)' }}>{isAr ? 'الصفحة غير موجودة' : 'Page not found'}</h1>
      <p style={{ color:'var(--t3)' }}>{isAr ? 'قد تكون الصفحة التي تبحث عنها قد نُقلت.' : "The page you're looking for may have moved."}</p>
      <Link to="/" style={{ color:'var(--em)', textDecoration:'underline', marginTop:'8px' }}>
        {isAr ? '← العودة إلى الأكاديمية' : '← Return to Academy'}
      </Link>
    </main>
  );
};
export default NotFoundPage;
