import Layout from '../components/Layout';
import dynamic from 'next/dynamic'

const SolarMap = dynamic(() => import('../components/SolarMap'),  { ssr: false })

export default function HomePage() {
	return (
		<Layout>
			<SolarMap />
        </Layout>
    )
};