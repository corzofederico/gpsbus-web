import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Historia from './app/historia'
import Home from './app/index'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/historia" element={<Historia />} />
			</Routes>
		</BrowserRouter>
	)
}