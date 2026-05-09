'use client'


export default function AuthForm() {
  return (
    <form className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl mb-4 font-bold">Login</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" className="w-full border p-2 rounded" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" className="w-full border p-2 rounded" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Sign In
      </button>
    </form>
  )
}
