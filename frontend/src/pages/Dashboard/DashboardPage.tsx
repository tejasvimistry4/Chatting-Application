const DashboardPage = () => {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
          💬
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Select a conversation
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose a chat from the sidebar to start messaging.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
