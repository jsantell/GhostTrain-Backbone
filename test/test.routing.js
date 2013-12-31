describe('Routing', function () {
  describe('Backbone Model', function () {
    it('POST Route', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        name: 'Ragnarr Loðbrók',
        job: 'Viking'
      });

      var response = {};

      gt.post('/users', function (req, res) {
        res.send(response);
      });

      user.save(null, {
        success: function (_, res) {
          expect(res).to.be.equal(response);
          done();
        }
      });
    });

    it('GET Route', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        id: 12345
      });

      var response = {};

      gt.get('/users/:id', function (req, res) {
        res.send(200, {
          name: 'Jesper Strömblad',
          job: 'shredding allday'
        });
      });

      user.fetch({
        success: function (_, res) {
          expect(res.name).to.be.equal('Jesper Strömblad');
          expect(res.job).to.be.equal('shredding allday');
          expect(user.get('name')).to.be.equal('Jesper Strömblad');
          expect(user.get('job')).to.be.equal('shredding allday');
          done();
        }
      });
    });

    it('PUT Route', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        name: 'Dominic Cifarelli',
        // Give it an id so Backbone thinks it's an update
        id: 12345
      });

      var response = {};

      gt.put('/users/:id', function (req, res) {
        res.send(response);
      });

      user.save(null, {
        success: function (_, res) {
          expect(res).to.be.equal(response);
          done();
        }
      });
    });

    it('DELETE Route', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt).User;
      var user = new User({
        name: 'Dominic Cifarelli',
        // Give it an id so Backbone thinks it's an update
        id: 12345
      });

      var response = {};

      gt.delete('/users/:id', function (req, res) {
        res.send(response);
      });

      user.destroy({
        success: function (_, res) {
          expect(res).to.be.equal(response);
          done();
        }
      });
    });
  });

  describe('Use $.Deferred if exists', function () {
    it('resolves promise with context and body on success', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt, $).User;
      var user = new User({
        name: 'Ragnarr Loðbrók',
        job: 'Viking'
      });

      var response = {};

      gt.post('/users', function (req, res) {
        res.send(response);
      });

      user.save().done(function (val) {
        expect(this).to.be.equal(user);
        expect(val).to.be.equal(response);
        done();
      });
    });
    
    it('rejects promise with context and error on failure', function (done) {
      var gt = new GhostTrain();
      var User = createModels(gt, $).User;
      var user = new User({
        name: 'Ragnarr Loðbrók',
        job: 'Viking'
      });

      var response = {};

      gt.post('/users', function (req, res) {
        res.send(404, 'womp womp womp');
      });

      user.save().fail(function (val) {
        expect(this).to.be.equal(user);
        expect(val).to.be.equal('womp womp womp');
        done();
      });
    });
  });
});
