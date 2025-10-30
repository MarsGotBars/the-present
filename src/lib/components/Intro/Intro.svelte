<section class="intro">
  <h1 class="title">Welcome to <span>the <span>present</span></span></h1>
  <p>Create, present, and captivate - in the moment.</p>
</section>

<style>
  .intro {
    font-size: var(--xxl-text);
    > .title {
      font-size: inherit;
      width: fit-content;
      margin-bottom: 0.75rem;

      &:hover span {
        color: var(--quaternary);
      }

      span {
        color: var(--tertiary);
        transition: color 0.2s ease-out;

        > span {
          position: relative;
          display: inline-block;
          margin-top: 0.5ch;

          @media (min-width: 47.5rem) {
            margin: unset;
          }

          &::after {
            content: "";
            position: absolute;
            width: 1em;
            height: 1em;
            top: -0.3em;
            right: -1.5ch;
            corner-shape: superellipse(-1.5);
            border-radius: 5rem;
            background-color: currentColor;
          }
        }
      }
    }
    > p {
      color: var(--tertiary);
    }
  }
</style>
