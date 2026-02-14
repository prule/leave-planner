<template>
  <div class="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">About Leave Planner</h2>

    <div class="prose prose-blue text-gray-600 space-y-4">
      <p>
        Welcome to the Leave Planner! This tool helps you track your leave balance and plan future holidays with ease.
      </p>

      <h3 class="text-lg font-semibold text-gray-800 mt-6">Why Use It?</h3>
      <p>
        Ever tried to book a holiday and wondered if you'll have enough leave? This tool is designed to answer that question. By projecting your leave balance into the future, you can:
      </p>
      <ul class="list-disc pl-5 space-y-2">
        <li>
          <strong>Plan with Confidence:</strong> See exactly how much leave you'll have for that big trip next year.
        </li>
        <li>
          <strong>Visualize Your Balance:</strong> The graph makes it easy to see when your leave balance is getting low, helping you avoid running out unexpectedly.
        </li>
        <li>
          <strong>Stay Accurate:</strong> Keep your balance perfectly in sync with your payslips by manually overriding the calculated values whenever you need to.
        </li>
      </ul>

      <h3 class="text-lg font-semibold text-gray-800 mt-6">How it Works</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>
          <strong>Spreadsheet View:</strong> The main interface acts like a spreadsheet. You can see your leave balance month-by-month.
        </li>
        <li>
          <strong>Automatic Projections:</strong> Based on your settings, the planner automatically estimates your future leave balance.
        </li>
        <li>
          <strong>Manual Overrides:</strong> For any month, you can override the estimated "Accrued" or "Closing" balance with the actual value from your payslip. Just click on the number and type in the correct amount.
        </li>
        <li>
          <strong>Leave Tracking:</strong> Click on the "Taken" column to add specific leave dates (e.g., "Fiji Trip").
        </li>
        <li>
          <strong>Days Calculation:</strong> Configure your "Hours Per Day" in settings to see your balance converted into days.
        </li>
      </ul>

      <h3 class="text-lg font-semibold text-gray-800 mt-6">Install as an App</h3>
      <p>
        You can install Leave Planner on your device for quick access, just like a native app.
      </p>

      <div class="mt-4 space-y-4">
        <div>
            <h4 class="font-medium text-gray-800">Desktop (Chrome / Edge)</h4>
            <p class="text-sm">Click the install icon in the address bar (usually on the right side) and select <strong>Install</strong>.</p>
        </div>
        <div>
            <h4 class="font-medium text-gray-800">iOS (Safari)</h4>
            <p class="text-sm">Tap the <strong>Share</strong> button, scroll down, and tap <strong>Add to Home Screen</strong>.</p>
        </div>
        <div>
            <h4 class="font-medium text-gray-800">Android (Chrome)</h4>
            <p class="text-sm">Tap the menu icon (three dots), then select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</p>
        </div>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Heroicon name: mini/exclamation-triangle -->
            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Important: Data Privacy & Storage</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>
                All your data is stored <strong>locally in your browser</strong> (using LocalStorage).
              </p>
              <p class="mt-2">
                This means:
              </p>
              <ul class="list-disc pl-5 mt-1 space-y-1">
                <li>Your data never leaves your device. It is private and secure.</li>
                <li>If you switch browsers or computers, your data <strong>will not</strong> be there.</li>
                <li>If you clear your browser data, you might lose your leave plan.</li>
              </ul>
              <p class="mt-2 font-medium">
                We recommend using the "Export Data" button in Settings to create a backup of your plan.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
