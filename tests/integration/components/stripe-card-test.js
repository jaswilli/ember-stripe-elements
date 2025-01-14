import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render, find, clearRender } from '@ember/test-helpers';
import StripeMock from '@adopted-ember-addons/ember-stripe-elements/test-support';

module('Integration | Component | stripe-card', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    window.Stripe = StripeMock;
    this.stripe = this.owner.lookup('service:stripev3');
    this.stripe.configure();
  });

  test('it renders', async function(assert) {
    await render(hbs`<StripeCard />`);

    assert.ok(find('.ember-stripe-element.ember-stripe-card'));
    assert.ok(find('[role="mount-point"]'));
    assert.equal(this.stripe.getActiveElements().length, 1);
  });

  test('yields out error message', async function(assert) {
    this.set('stripeError', { message: 'oops' });
    await render(hbs`
      <StripeCard @stripeError={{this.stripeError}} as |stripeElement stripeError|>
        {{stripeError.message}}
      </StripeCard>
    `);

    assert.equal(this.element.querySelector('.ember-stripe-element').textContent.trim(), 'oops');

    await clearRender();

    assert.equal(this.stripe.getActiveElements().length, 0);
  });
});
