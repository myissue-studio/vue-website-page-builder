<template>
  <teleport to="body">
    <div
      class="pbx-bg-white pbx-flex pbx-justify-center pbx-items-center min-pbx-h-screen pbx-h-screen pbx-w-screen pbx-fixed pbx-inset-0 pbx-z-[10000]"
    >
      <div class="pbx-absolute pbx-top-1/3">
        <div class="pbx-flex pbx-items-center pbx-justify-center pbx-mt-4">
          <div
            class="pbx-inline-block pbx-h-8 pbx-w-8 pbx-animate-spin pbx-rounded-full pbx-border-4 pbx-border-solid pbx-border-current pbx-border-r-transparent pbx-align-[-0.125em] motion-reduce:pbx-animate-[spin_1.5s_linear_infinite]"
          >
            <span
              class="!pbx-absolute !pbx-m-px !pbx-h-px !pbx-w-px !pbx-overflow-hidden !pbx-whitespace-nowrap !pbx-border-0 !pbx-p-0 !pbx-[clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
